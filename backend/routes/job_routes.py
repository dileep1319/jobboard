from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from models.job import Job
from db import db
from sqlalchemy.exc import IntegrityError

job_routes = Blueprint("job_routes", __name__)

# ✅ GET /jobs - return list of jobs (with optional filters + pagination)
@job_routes.route("/jobs", methods=["GET"])
def get_jobs():
    query = Job.query

    # --- Filters ---
    job_type = request.args.get("job_type")
    location = request.args.get("location")
    tag = request.args.get("tag")
    sort = request.args.get("sort")

    if job_type:
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if tag:
        query = query.filter(Job.tags.ilike(f"%{tag}%"))

    # --- Sorting ---
    if sort == "posting_date_asc":
        query = query.order_by(Job.posting_date.asc())
    else:
        query = query.order_by(Job.posting_date.desc())

    # --- Pagination ---
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 8))  # 8 jobs per page by default

    total_jobs = query.count()
    jobs = query.offset((page - 1) * limit).limit(limit).all()

    job_list = [
        {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "posting_date": job.posting_date.strftime("%Y-%m-%d"),
            "job_type": job.job_type,
            "sector": job.sector,
            "tags": job.tags,
        }
        for job in jobs
    ]

    return jsonify({
        "jobs": job_list,
        "total_jobs": total_jobs,
        "total_pages": (total_jobs + limit - 1) // limit,
        "current_page": page
    }), 200

    query = Job.query

    job_type = request.args.get("job_type")
    location = request.args.get("location")
    tag = request.args.get("tag")
    sort = request.args.get("sort")

    if job_type:
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if tag:
        query = query.filter(Job.tags.ilike(f"%{tag}%"))

    # ✅ Default to newest first
    if sort == "posting_date_asc":
        query = query.order_by(Job.posting_date.asc())
    else:
        query = query.order_by(Job.posting_date.desc())

    jobs = query.all()

    job_list = [
        {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "posting_date": job.posting_date.strftime("%Y-%m-%d"),
            "job_type": job.job_type,
            "sector": job.sector,
            "tags": job.tags,
        }
        for job in jobs
    ]
    return jsonify(job_list), 200

    query = Job.query

    job_type = request.args.get("job_type")
    location = request.args.get("location")
    tag = request.args.get("tag")
    sector = request.args.get("sector")
    sort = request.args.get("sort")

    if job_type:
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))
    if sector:
        query = query.filter(Job.sector.ilike(f"%{sector}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if tag:
        query = query.filter(Job.tags.ilike(f"%{tag}%"))

    if sort == "posting_date_desc":
        query = query.order_by(Job.posting_date.desc())
    elif sort == "posting_date_asc":
        query = query.order_by(Job.posting_date.asc())

    jobs = query.all()

    job_list = [
        {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "posting_date": job.posting_date.strftime("%Y-%m-%d"),
            "job_type": job.job_type,
            "sector": job.sector,
            "tags": job.tags,
        }
        for job in jobs
    ]
    return jsonify(job_list), 200


# ✅ GET /jobs/<id> - return one job
@job_routes.route("/jobs/<int:id>", methods=["GET"])
def get_job(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    job_data = {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "posting_date": job.posting_date.strftime("%Y-%m-%d"),
        "job_type": job.job_type,
        "sector": job.sector,
        "tags": job.tags,
    }
    return jsonify(job_data), 200


# ✅ POST /jobs - add new job
@job_routes.route("/jobs", methods=["POST"])
def create_job():
    data = request.get_json()

    # For scraped jobs, job_type might be missing, sector might be present
    required_fields = ["title", "company", "location"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    try:
        new_job = Job(
            title=data["title"],
            company=data["company"],
            location=data["location"],
            posting_date=datetime.now(timezone.utc),
            job_type=data.get("job_type", None),  # Optional
            sector=data.get("sector", None),       # ✅ new field handled
            tags=data.get("tags", ""),
        )

        db.session.add(new_job)
        db.session.commit()

        return jsonify({"message": "Job created", "id": new_job.id}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Duplicate job skipped"}), 409

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500


# ✅ PUT /jobs/<id> - update existing job
@job_routes.route("/jobs/<int:job_id>", methods=["PUT", "PATCH"])
def update_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    data = request.get_json()

    try:
        job.title = data.get("title", job.title)
        job.company = data.get("company", job.company)
        job.location = data.get("location", job.location)
        job.job_type = data.get("job_type", job.job_type)
        job.sector = data.get("sector", job.sector)
        job.tags = data.get("tags", job.tags)

        db.session.commit()
        return jsonify({"message": f"Job {job_id} updated"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500


# ✅ DELETE /jobs/<id> - remove job
@job_routes.route("/jobs/<int:job_id>", methods=["DELETE"])
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    try:
        db.session.delete(job)
        db.session.commit()
        return jsonify({"message": f"Job {job_id} deleted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
