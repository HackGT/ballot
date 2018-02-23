/*
 * SAMPLE DATA
 * Run this if you want to populate your database with test data
 */

-- Users
INSERT INTO users(email, name, user_class)
    VALUES ('test1@hack.gt', 'Some guys name', 'Pending'),
           ('test2@gatech.edu', 'Some judge name', 'Owner'),
           ('letmein@gmail.com', 'Some random dudes name', 'Admin')

-- projects

INSERT INTO projects(project_id, devpost_id, name, table_number)
    VALUES (1234, 1, 'Machine Learning for Fizzbuzz', 1),
           (1337, 2, 'Crowdsourced Bitcoin', 2),
           (2200, 3, 'Pipelined Processor', 3)

-- categories

-- criteria

-- ballots

-- project_categories
