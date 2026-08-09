import os

class SupabaseService:
    @staticmethod
    def get_client():
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
        
        if not url or not key:
            return None

        try:
            from supabase import create_client, Client
            return create_client(url, key)
        except Exception as err:
            print(f"Supabase client initialization error: {err}")
            return None

    @staticmethod
    def upload_file(bucket_name: str, file_path: str, destination_path: str) -> str | None:
        client = SupabaseService.get_client()
        if not client:
            return None

        try:
            with open(file_path, 'rb') as f:
                res = client.storage.from_(bucket_name).upload(destination_path, f)
                if res:
                    public_url = client.storage.from_(bucket_name).get_public_url(destination_path)
                    return public_url
        except Exception as err:
            print(f"Failed to upload file to Supabase bucket '{bucket_name}': {err}")
            return None
        return None

supabase_service = SupabaseService()
