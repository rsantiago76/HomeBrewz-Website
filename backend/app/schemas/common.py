from pydantic import BaseModel

class Msg(BaseModel):
    msg: str

class HTTPError(BaseModel):
    detail: str
