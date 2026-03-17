try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    HAS_FIREBASE = True
except ImportError:
    HAS_FIREBASE = False
import os
import time
from typing import Optional, Dict, Any
from db_manager import get_user_clearance_local, update_user_credits as update_user_credits_local
from logger import bureau_logger

class BureauFirebaseManager:
    """
    The plumbing for the Bureau's SaaS Ecosystem.
    Handles persistence, clearance protocols, and mission data.
    """
    def __init__(self):
        self.db = None
        self._initialize_firebase()

    def _initialize_firebase(self):
        if not HAS_FIREBASE:
            bureau_logger.info("Bureau Vault (Firebase) Context: UNAVAILABLE (Library not installed)")
            self.db = None
            return

        try:
            # The Bureau's High-Resolution Truth Layer (Firebase)
            # Fetching credentials from Environment for high-security deployment
            project_id = os.getenv("FIREBASE_PROJECT_ID")
            client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
            private_key = os.getenv("FIREBASE_PRIVATE_KEY")

            if project_id and client_email and private_key:
                # Handle \n in the env string
                parsed_key = private_key.replace('\\n', '\n')
                
                if not firebase_admin._apps:
                    cred = credentials.Certificate({
                        "project_id": project_id,
                        "client_email": client_email,
                        "private_key": parsed_key,
                        "type": "service_account",
                        "token_uri": "https://oauth2.googleapis.com/token",
                    })
                    firebase_admin.initialize_app(cred)
                
                self.db = firestore.client()
                bureau_logger.info(f"Bureau Vault (Firebase) Context: INITIALIZED [Project: {project_id}]")
            else:
                bureau_logger.warning("Bureau Vault (Firebase) Context: KEYS MISSING IN .ENV - Falling back to structural SQLite")
                self.db = None
        except Exception as e:
            bureau_logger.error(f"Bureau Vault (Firebase) Context: CRITICAL INITIALIZATION FAILURE | Detail: {str(e)}")
            self.db = None

    async def save_visual_asset(self, asset_data: Dict[str, Any], tier: str = "FREE") -> str:
        """Saves a generated illustration to the Bureau Vault."""
        if not self.db: return "local_only"
        
        doc_ref = self.db.collection("visual_assets").document()
        asset_record = {
            **asset_data,
            "id": doc_ref.id,
            "tier_captured": tier,
            "timestamp": time.time(),
            "status": "active"
        }
        doc_ref.set(asset_record)
        return doc_ref.id

    async def get_visual_asset(self, asset_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves an asset from the vault."""
        if not self.db: return None
        
        doc = self.db.collection("visual_assets").document(asset_id).get()
        return doc.to_dict() if doc.exists else None

    async def update_user_clearance(self, email: str, level: int):
        """Sets the clearance level for a user (Conductor Action)."""
        if not self.db: return
        
        user_ref = self.db.collection("users").document(email)
        user_ref.set({
            "clearance_level": level,
            "updated_at": time.time()
        }, merge=True)

    async def check_clearance(self, email: str) -> Dict[str, Any]:
        """Verifies if a user can access the 'High-Resolution Truth'."""
        if not self.db: 
            local_data = await get_user_clearance_local(email)
            return {
                "clearance_level": local_data.get("clearance_level", 0),
                "credits": local_data.get("credits", 3) # Force 3 for local too
            }
        
        user_ref = self.db.collection("users").document(email)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            data = user_doc.to_dict()
            return {
                "clearance_level": data.get("clearance_level", 0),
                "credits": data.get("credits", 3)
            }
        else:
            # NEW USER DETECTED: Initialization with the 'Rule of 3' (Founder Uses)
            initial_data = {
                "clearance_level": 0,
                "credits": 3,
                "created_at": time.time(),
                "role": "early_adopter"
            }
            user_ref.set(initial_data)
            bureau_logger.info(f"FOUNDER DETECTED: Initialized {email} with 3 free validation runs.")
            return {"clearance_level": 0, "credits": 3}

    async def update_user_credits(self, email: str, amount: int):
        """Adds or spends credits in the Firebase vault."""
        if not self.db:
            await update_user_credits_local(email, amount)
            return
        
        user_ref = self.db.collection("users").document(email)
        user_doc = user_ref.get()
        
        current_credits = user_doc.to_dict().get("credits", 3) if user_doc.exists else 3
        new_balance = max(0, current_credits + amount)
        
        user_ref.set({
            "credits": new_balance,
            "updated_at": time.time()
        }, merge=True)
        bureau_logger.info(f"CREDIT_SYNC: {email} | Balance: {new_balance} (Changed by {amount})")

    async def save_mission(self, mission_id: str, mission_data: Dict[str, Any]):
        """Saves a mission record to the vault."""
        if not self.db: return
        
        email = mission_data.get("config", {}).get("user_email")
        
        doc_ref = self.db.collection("missions").document(mission_id)
        doc_ref.set({
            **mission_data,
            "user_email": email,
            "server_timestamp": firestore.SERVER_TIMESTAMP,
            "status": mission_data.get("status", "completed")
        })

    async def list_user_missions(self, email: str, limit: int = 10):
        """Retrieves history for a specific user."""
        if not self.db: return []
        
        try:
            missions_ref = self.db.collection("missions")
            # Filter by user email and sort by newest
            query = missions_ref.where("user_email", "==", email).order_by("server_timestamp", direction=firestore.Query.DESCENDING).limit(limit)
            docs = query.get()
            
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            bureau_logger.error(f"Failed to list user missions from Firebase: {e}")
            return []

# Singleton instance
bureau_vault = BureauFirebaseManager()
