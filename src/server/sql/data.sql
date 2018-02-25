/* 
 * SAMPLE DATA
 * Run this if you want to populate your database with test data
 */

-- Users
INSERT INTO users(email, name, user_class)
    VALUES ('test1@hack.gt', 'Some guys name', 'Owner'),
           ('test2@gatech.edu', 'Some judge name', 'Judge'),
           ('letmein@gmail.com', 'Some random dudes name', 'Pending');

-- projects

-- categories
INSERT INTO categories(name, is_primary)
    VALUES ('Best ML Hack', True),
           ('Best Mobile', True),
           ('Best Web', True);

-- criteria
INSERT INTO criteria(name, rubric, min_score, max_score, category_id)
    VALUES ('Tensorflow Usage', 'scored 1 - 10', 1, 10, 1),
           ('UI Score', 'scored 1 - 5', 1, 5, 3);

-- ballots

-- project_categories
