package model

import (
	"context"

	"github.com/go-pg/pg/v10"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

// InitDB initializes DB from config.
func InitDB() *pg.DB {
	opt := pgOptionsFromConfig()
	db := pg.Connect(opt)
	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("unable to connect to database: %v", err)
	}
	log.Infof("connected to database %v", opt.Addr)
	return db
}

func pgOptionsFromConfig() *pg.Options {
	url := viper.GetString("database_url")
	opt, err := pg.ParseURL(url)
	if err != nil {
		log.Fatalf("unable to parse DATABASE_URL: %v", err)
	}
	return opt
}
