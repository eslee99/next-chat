package user

import "context"

type User struct {
	ID       int64  `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type CreateUserReq struct {
	Username string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type CreateUserResp struct {
	ID       string `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
}

type LoginUserReq struct {
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type LoginUserResp struct {
	accessToken string
	ID          string `json:"id" db:"id"`
	Username    string `json:"username" db:"username"`
}

type Repository interface {
	CreateUser(context.Context, *User) (*User, error)
	GetUserByEmail(context.Context, string) (*User, error)
}

type Service interface {
	CreateUser(context.Context, *CreateUserReq) (*CreateUserResp, error)
	Login(c context.Context, req *LoginUserReq) (*LoginUserResp, error)
}
