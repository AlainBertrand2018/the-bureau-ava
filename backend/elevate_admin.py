import asyncio
import os
import sys

# Add current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db_manager import set_user_clearance, init_db
from firebase_manager import bureau_vault

async def set_super_admin():
    print("Initializing Bureau OS Registry...")
    await init_db()
    
    # Set Local Super Admin
    emails = ["bertrand.chagal@gmail.com", "executive@bureau.ai"]
    for email in emails:
        print(f"Assigning Super Admin Clearance to: {email}")
        await set_user_clearance(email, 10, is_super=True)
        # Also try to update the vault if accessible
        try:
            await bureau_vault.update_user_clearance(email, 10)
            print(f"Vault clearance updated for {email}")
        except:
            print(f"Vault sync pending for {email}")

    print("Bureau Authorization Protocol: COMPLETE.")

if __name__ == "__main__":
    asyncio.run(set_super_admin())
