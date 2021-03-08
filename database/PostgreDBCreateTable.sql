/* "Unnamed" 세션 시작 */
/*Maria DB Script */
create database monolithic;
CREATE TABLE USERS (
	user_id SERIAL,
	-- Postgre 자동증가타입
	user_name VARCHAR(32) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	update_at TIMESTAMP NULL,
	PRIMARY KEY (user_id)
);
/* SQL 오류 (1067): Invalid default value for 'created_at' */
CREATE TABLE CONTENT (
	content_id SERIAL,
	user_id INT NOT NULL,
	title VARCHAR(32) NOT NULL,
	context TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL,
	update_at TIMESTAMP NULL,
	PRIMARY KEY (content_id)
);
/* "Unnamed" 세션 시작 */
CREATE TABLE COMMENT (
	comment_id SERIAL,
	user_id INT NOT NULL,
	content_id INT NOT NULL,
	context VARCHAR(32) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (comment_id)
);
/* "Unnamed" 세션 시작 */
CREATE TABLE SUB_COMMENT (
	sub_comment_id SERIAL,
	user_id INT NOT NULL,
	comment_id INT NOT NULL,
	context VARCHAR(32) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY (sub_comment_id)
);
/* "Unnamed" 세션 시작 */