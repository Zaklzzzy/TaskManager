from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

    def set_password(self, password):
        self.password = password

    def check_password(self, password):
        return self.password == password


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(75), nullable=False)
    description = db.Column(db.String(250))
    done = db.Column(db.Boolean, default=False)
    todo = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)