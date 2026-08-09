import random
import uuid
from datetime import datetime

class AIQuestionGeneratorService:
    QUESTION_BANK = {
        'Agentic AI': [
            {
                'text': "How do autonomous AI Agents handle multi-step reasoning, plan decomposition, and tool execution loops when resolving complex workflows?",
                'topicTag': 'Agentic Architecture',
                'codeSnippet': "async function executeAgentLoop(agent, goal) {\n  const plan = await agent.decompose(goal);\n  for (const step of plan) {\n    const toolResult = await agent.callTool(step.tool, step.args);\n    agent.updateMemory(step, toolResult);\n  }\n}"
            },
            {
                'text': "Explain the dynamic ReAct (Reasoning + Acting) prompt strategy. How does it prevent agent hallucination during live external API interactions?",
                'topicTag': 'ReAct Pattern',
                'codeSnippet': "Think: Candidate requires database metrics.\nAction: query_postgres_db(sql)\nObservation: Data returned cleanly."
            },
            {
                'text': "What memory management techniques (short-term, long-term vector DB, episodic) are most effective for maintaining agent context without breaching token windows?",
                'topicTag': 'Agent Memory'
            }
        ],
        'RAG & Vector DB': [
            {
                'text': "What strategies improve retrieval precision in RAG systems (Hybrid Search, Reciprocal Rank Fusion, Cohere Reranking)?",
                'topicTag': 'Hybrid Search & Reranking',
                'codeSnippet': "from qdrant_client import QdrantClient\nclient = QdrantClient(url='http://localhost:6333')\nresults = client.search(collection_name='docs', query_vector=vec, limit=5)"
            },
            {
                'text': "How do parent-document retrievers and hierarchical chunking resolve the tradeoff between embedding context granularities and LLM generator prompt sizes?",
                'topicTag': 'Hierarchical Chunking'
            }
        ],
        'MCP & AI Infrastructure': [
            {
                'text': "Explain Model Context Protocol (MCP). How does it standardize client-server resource discovery and tool invocation for local and remote LLM tools?",
                'topicTag': 'MCP Standard',
                'codeSnippet': "{\n  \"mcpVersion\": \"1.0\",\n  \"tools\": [{ \"name\": \"run_query\", \"parameters\": { \"sql\": \"string\" } }]\n}"
            }
        ],
        'HTML & Frontend': [
            {
                'text': "How does React 19 handle concurrent rendering, automatic batching, and server components to maintain high frame-rate responsiveness under heavy DOM updates?",
                'topicTag': 'React Concurrent Engine'
            }
        ]
    }

    @staticmethod
    def generate_question(topic: str, difficulty: str, persona: str, previous_questions: list[str]) -> dict:
        topic_bank = AIQuestionGeneratorService.QUESTION_BANK.get(topic, AIQuestionGeneratorService.QUESTION_BANK['Agentic AI'])
        
        # Filter out questions already asked in session
        available = [q for q in topic_bank if q['text'] not in previous_questions]
        if not available:
            available = topic_bank

        selected = random.choice(available)
        return {
            'id': f"msg-{Date.now() if 'Date' in globals() else random.randint(1000, 9999)}",
            'sender': 'ai',
            'text': selected['text'],
            'timestamp': datetime.now().strftime('%I:%M %p'),
            'topicTag': selected.get('topicTag', topic),
            'difficultyLevel': difficulty,
            'codeSnippet': selected.get('codeSnippet')
        }

    @staticmethod
    def evaluate_answer(answer_text: str, question_text: str, difficulty: str) -> dict:
        words = answer_text.strip().split()
        word_count = len(words)

        if word_count < 10:
            score = random.randint(55, 68)
            feedback = "Brief answer. Recommend adding architectural detail, specific libraries, and production edge-case handling."
            missing = ["In-depth technical justification", "Production edge cases"]
        elif word_count < 30:
            score = random.randint(75, 86)
            feedback = "Solid response covering fundamental concepts clearly. Consider elaborating on latency SLAs and failure fallbacks."
            missing = ["Latency SLAs"]
        else:
            score = random.randint(88, 98)
            feedback = "Excellent, comprehensive response demonstrating deep domain proficiency and production-level design intuition."
            missing = []

        return {
            'score': score,
            'feedback': feedback,
            'coveredConcepts': ["Domain fundamentals", "Architecture intuition"],
            'missingConcepts': missing,
            'followupSuggestion': "How would you handle horizontal scaling under 10x traffic spikes?"
        }

    @staticmethod
    def generate_followup(previous_answer: str, topic: str, difficulty: str) -> dict:
        followups = [
            f"Based on your response regarding {topic}, how would you monitor latency metrics and ensure zero data loss during high concurrency bursts?",
            f"That's a sound approach. What specific failure modes or race conditions have you encountered when running this implementation in production?",
            f"Building on your points, how would you design automated unit and integration test suites for this specific system boundary?"
        ]
        
        return {
            'id': f"msg-{random.randint(1000, 9999)}",
            'sender': 'ai',
            'text': random.choice(followups),
            'timestamp': datetime.now().strftime('%I:%M %p'),
            'topicTag': f"{topic} Follow-up",
            'difficultyLevel': difficulty
        }
