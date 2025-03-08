from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    hashed_password: str
    
    class Config:
        from_attributes = True


class TestBase(BaseModel):
    title: str
    subject: str
    duration: int

class TestCreate(TestBase):
    pass

class Test(TestBase):
    id: int
    
    class Config:
        orm_mode = True

class QuestionBase(BaseModel):
    text: str
    options: List[str]
    correct_answer: int

class QuestionCreate(QuestionBase):
    test_id: int

class Question(QuestionBase):
    id: int
    test_id: int
    
    class Config:
        orm_mode = True

class UserAnswerBase(BaseModel):
    question_id: int
    selected_option: int

class TestResultBase(BaseModel):
    user_id: int
    test_id: int
    score: float
    time_spent: int
    submitted_at: datetime

class TestResultCreate(TestResultBase):
    answers: List[UserAnswerBase]

class TestResult(TestResultBase):
    id: int
    
    class Config:
        orm_mode = True
