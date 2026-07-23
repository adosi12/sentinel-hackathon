from app.db.session import SessionLocal
from app.db.models import User
from app.core.security import get_password_hash

def seed_users():
    db = SessionLocal()
    
    users = [
        {"email": "admin@bank.internal", "password": "password123", "role": "admin"},
        {"email": "oncall-mobile@bank.internal", "password": "password123", "role": "user"},
        {"email": "sre-core@bank.internal", "password": "password123", "role": "user"},
        {"email": "l2-support@bank.internal", "password": "password123", "role": "user"},
        {"email": "manager@bank.internal", "password": "password123", "role": "viewer"}
    ]
    
    for u in users:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if not existing:
            user = User(
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"],
                is_active=True
            )
            db.add(user)
            print(f"Created user: {u['email']}")
        else:
            print(f"User already exists: {u['email']}")
            
    db.commit()
    db.close()
    print("Users seeded successfully.")

if __name__ == "__main__":
    seed_users()
