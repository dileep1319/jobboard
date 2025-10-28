from datetime import datetime, timezone
from db import db

class Job(db.Model):
    __tablename__ = "jobs"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    posting_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    job_type = db.Column(db.String(100), nullable=False)
    tags = db.Column(db.String(255))

    __table_args__ = (
        db.UniqueConstraint("title", "company", "location", name="unique_job"),
    )

    def __repr__(self):
        return f"<Job {self.title} at {self.company}>"
