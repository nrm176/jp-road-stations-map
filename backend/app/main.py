from fastapi import FastAPI, Query, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import ForeignKey, Float
from sqlalchemy.orm import aliased
from fastapi.middleware.cors import CORSMiddleware
import os

DATABASE_URL = "sqlite:///app/project.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# print current working directory
print(os.getcwd())
Base = declarative_base()


class RailStation(Base):
    __tablename__ = 'rail_station'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    lat = Column(Float)
    lon = Column(Float)


class RoadStation(Base):
    __tablename__ = 'road_station'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    postal_code = Column(String)
    full_address = Column(String)
    prefecture = Column(String, ForeignKey('pref_code.name'), index=True)


class Distance(Base):
    __tablename__ = 'distance'

    road_station_id = Column(String, ForeignKey('road_station.id'), primary_key=True, index=True)
    rail_station_id = Column(String, ForeignKey('rail_station.id'), primary_key=True, index=True)
    distance = Column(Float)


class Prefecture(Base):
    __tablename__ = 'pref_code'
    code = Column(String, primary_key=True, index=True)
    name = Column(String, primary_key=True, index=True)
    city = Column(String)
    lat = Column(Float)
    lon = Column(Float)


origins = [
    "http://localhost:3001",  # React app address
    "http://127.0.0.1:3001",
    "http://localhost:3000",  # React app address
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    # add more origins if needed
]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/rail-stations/")
def get_rail_stations(skip: int = Query(0, alias="offset"), limit: int = Query(10), db: SessionLocal = Depends(get_db)):
    stations = db.query(RailStation).offset(skip).limit(limit).all()
    return {"stations": stations}


@app.get("/rail-stations/{name}")
def get_rail_station_by_name(name: str, db: SessionLocal = Depends(get_db)):
    station = db.query(RailStation).filter(RailStation.name == name).first()
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return {"station": station}


@app.get("/distances/{road_station_id}/{rail_station_id}")
def get_distance_by_ids(road_station_id: str, rail_station_id: str, db: SessionLocal = Depends(get_db)):
    distance_record = db.query(Distance).filter(Distance.road_station_id == road_station_id,
                                                Distance.rail_station_id == rail_station_id).first()
    if distance_record is None:
        raise HTTPException(status_code=404, detail="Distance record not found")
    return {"distance": distance_record}


# get records by prefecture and distance. both distance and prefecture are query parameters.
# For example, the endpoint would be GET /distances/?offset=0&limit=100&max_distance=1&prefecture=東京都
@app.get("/distances/")
def get_distances(skip: int = Query(0, alias="offset"), limit: int = Query(500), max_distance: float = None,
                  pref_code: int = None, db: SessionLocal = Depends(get_db)):
    road_station = aliased(RoadStation)
    rail_station = aliased(RailStation)
    prefecture = aliased(Prefecture)

    query = (db.query(Distance,
                      road_station.full_address,
                      road_station.name.label('road_station_name'),
                      road_station.postal_code,
                      road_station.lat.label('road_station_lat'),
                      road_station.lon.label('road_station_lon'),
                      road_station.prefecture,
                      rail_station.name.label('rail_station_name'),
                      rail_station.lat.label('rail_station_lat'),
                      rail_station.lon.label('rail_station_lon'),
                      prefecture.code.label('pref_code'),
                      prefecture.lat.label('pref_lat'),
                      prefecture.lon.label('pref_lon'))
             .join(road_station, Distance.road_station_id == road_station.id)
             .join(rail_station, Distance.rail_station_id == rail_station.id)
             .join(prefecture, road_station.prefecture == prefecture.name))
    if max_distance is not None:
        query = query.filter(Distance.distance <= max_distance)

    # Handle a case where the pref_code is not None
    if pref_code and pref_code != 0:
        query = query.filter(prefecture.code == pref_code)

    records = query.order_by(Distance.distance.asc()).offset(skip).limit(limit).all()

    data = [
        {
            "road_station": {
                "id": record.Distance.road_station_id,
                "name": record.road_station_name,
                "full_address": record.full_address,
                "prefecture": record.prefecture,
                "pref_code": record.pref_code,
                "lat": record.road_station_lat,
                "lon": record.road_station_lon,
            },
            "rail_station": {
                "id": record.Distance.rail_station_id,
                "name": record.rail_station_name,
                "lat": record.rail_station_lat,
                "lon": record.rail_station_lon,
            },
            "distance": "%.2f" % record.Distance.distance
        }
        for record in records
    ]

    # sleep for 2 seconds
    # time.sleep(2)

    return {
        "records": data,
        "prefecture": {
            "code": records[0].pref_code,
            "name": records[0].prefecture,
            "lat": records[0].pref_lat,
            "lon": records[0].pref_lon,
        } if len(records) > 0 else None
    }


# Get the list of prefecture name, code, lat and lon
@app.get("/prefectures/")
def get_prefectures(db: SessionLocal = Depends(get_db)):
    prefectures = db.query(Prefecture).all()
    return prefectures
