CREATE USER 'tendai_tasker'@'localhost' IDENTIFIED BY '%A9]+pL7hf4^ghfs476%%*';
CREATE USER 'tendai_tasker'@'%' IDENTIFIED BY '%A9]+pL7hf4^ghfs476%%*';

CREATE DATABASE IF NOT EXISTS tendai_task;
use tendai_task;

GRANT INSERT,SELECT,UPDATE ON tendai_task_book.* TO `tendai_tasker`@`localhost`;
GRANT INSERT,SELECT,UPDATE ON tendai_task_book.* TO `tendai_tasker`@`%`;

CREATE TABLE IF NOT EXISTS history(
  email           VARCHAR(128) NOT NULL,
  company_symbol  VARCHAR(12) NOT NULL, 
  start_date      DATE NOT NULL, 
  end_date        DATE NOT NULL,
  UNIQUE(email,company_symbol, start_date, end_date)
);