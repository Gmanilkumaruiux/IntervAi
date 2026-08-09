import { SpeechSettings, VoiceGender, VoiceAccent } from '../types/interview';

class SpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synthesis) {
      this.voices = this.synthesis.getVoices();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synthesis) {
      this.voices = this.synthesis.getVoices();
    }
    return this.voices;
  }

  /**
   * Select best natural voice based on Gender (Female/Male) & Accent (US/UK/Indian)
   */
  public getBestVoiceForProfile(gender: VoiceGender, accent: VoiceAccent): SpeechSynthesisVoice | null {
    const allVoices = this.getAvailableVoices();
    if (allVoices.length === 0) return null;

    const langCodes: Record<VoiceAccent, string[]> = {
      US: ['en-US', 'en_US'],
      UK: ['en-GB', 'en_GB', 'en-UK'],
      Indian: ['en-IN', 'en_IN']
    };

    const targetLangs = langCodes[accent] || langCodes.US;

    // Filter by locale first
    let localeVoices = allVoices.filter(v => targetLangs.some(l => v.lang.toLowerCase().includes(l.toLowerCase())));
    if (localeVoices.length === 0) localeVoices = allVoices.filter(v => v.lang.toLowerCase().startsWith('en'));

    // Female voice keywords
    const femaleKeywords = ['samantha', 'victoria', 'karen', 'moira', 'zira', 'google us english', 'fiona', 'veena', 'female', 'natural'];
    // Male keywords
    const maleKeywords = ['daniel', 'alex', 'david', 'fred', 'rishi', 'george', 'male', 'guy', 'google uk english male'];

    const targetKeywords = gender === 'Female' ? femaleKeywords : maleKeywords;

    // Try finding exact match with keyword
    const keywordMatch = localeVoices.find(v => targetKeywords.some(k => v.name.toLowerCase().includes(k)));
    if (keywordMatch) return keywordMatch;

    return localeVoices[0] || allVoices[0] || null;
  }

  /**
   * Speak question automatically with high clarity & phonetic term sanitation
   */
  public speakQuestion(text: string, settings: SpeechSettings): void {
    if (!this.synthesis || settings.isMuted || !settings.enabled) return;

    this.stopSpeaking();

    // Sanitize text for natural human pronunciation
    const sanitizedText = this.sanitizeTextForPhoneticSpeech(text);

    const utterance = new SpeechSynthesisUtterance(sanitizedText);
    utterance.rate = settings.rate || 1.0;
    utterance.pitch = settings.pitch || 1.0;
    utterance.volume = settings.volume || 1.0; // Max volume clarity

    const voice = this.getBestVoiceForProfile(settings.gender || 'Female', settings.accent || 'US');
    if (voice) {
      utterance.voice = voice;
    }

    this.activeUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  /**
   * Replay active question
   */
  public replayQuestion(text: string, settings: SpeechSettings): void {
    this.speakQuestion(text, settings);
  }

  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.activeUtterance = null;
    }
  }

  /**
   * STT Speech Recognition methods
   */
  public startListening(onResult: (text: string) => void, onError: (err: any) => void): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('Speech recognition not supported in browser.');
      return;
    }

    this.stopListening();

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    this.recognition.onerror = (event: any) => onError(event.error);
    this.recognition.start();
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch { /* ignore */ }
      this.recognition = null;
    }
  }

  /**
   * Phonetic Sanitizer: Converts code blocks & acronyms for natural human reading
   */
  public sanitizeTextForPhoneticSpeech(rawText: string): string {
    let clean = rawText;

    // Replace Markdown Code Blocks with natural pause
    clean = clean.replace(/```[\s\S]*?```/g, ' [Code snippet displayed on screen] ');
    clean = clean.replace(/`([^`]+)`/g, '$1');

    // Remove markdown symbols
    clean = clean.replace(/[*#_\-\[\]]/g, ' ');

    // Normalize technical acronyms for clear pronunciation
    const termReplacements: Record<string, string> = {
      'HTML': 'H T M L',
      'CSS': 'C S S',
      'RAG': 'RAG',
      'MCP': 'M C P',
      'K8s': 'Kubernetes',
      'vLLM': 'V L L M',
      'API': 'A P I',
      'APIs': 'A P Is',
      'SQL': 'S Q L',
      'AWS': 'A W S',
      'JSON': 'J-SON',
      'REST': 'REST',
      'DOM': 'D O M',
      'URL': 'U R L',
      'PDF': 'P D F',
      'DOCX': 'D O C X'
    };

    Object.entries(termReplacements).forEach(([term, replacement]) => {
      const regex = new RegExp(`\\b${term}\\b`, 'g');
      clean = clean.replace(regex, replacement);
    });

    // Add slight pauses after sentences for natural pacing
    clean = clean.replace(/([.?!])\s+/g, '$1 ... ');

    return clean;
  }
}

export const speechService = new SpeechService();
