/* 
 * SAMPLE DATA
 * Run this if you want to populate your database with test data
 */

-- Users (all passwords are 'password')
INSERT INTO users(email, name, user_class, salt, hash)
    VALUES ('test1@hack.gt', 'Some guys name', 'Owner', 'b3195525f8f84b10adc85ada7deab84a30c579e777ae27973c92f812d84476e3', '46b0d61cccb35a2b4e15796abaf66c4daf50b9fc0a0efe3fee825b375301eb0dbabb2193926113b970f8b6285fdb56436c7d58dd13c0424356e0457cc71e7496a0dde47046d19f2dcde24e6956aa0599340c8b080c582a5cb7171193e7167894a0406f610e9f98eaa1ff4de4f5b010b1105985d9fa1d7eb255df8b9151230d5e'),
           ('test2@gatech.edu', 'Some ML judge', 'Judge', 'b3195525f8f84b10adc85ada7deab84a30c579e777ae27973c92f812d84476e3', '46b0d61cccb35a2b4e15796abaf66c4daf50b9fc0a0efe3fee825b375301eb0dbabb2193926113b970f8b6285fdb56436c7d58dd13c0424356e0457cc71e7496a0dde47046d19f2dcde24e6956aa0599340c8b080c582a5cb7171193e7167894a0406f610e9f98eaa1ff4de4f5b010b1105985d9fa1d7eb255df8b9151230d5e'),
           ('test3@gatech.edu', 'Some other ML judge', 'Judge', 'b3195525f8f84b10adc85ada7deab84a30c579e777ae27973c92f812d84476e3', '46b0d61cccb35a2b4e15796abaf66c4daf50b9fc0a0efe3fee825b375301eb0dbabb2193926113b970f8b6285fdb56436c7d58dd13c0424356e0457cc71e7496a0dde47046d19f2dcde24e6956aa0599340c8b080c582a5cb7171193e7167894a0406f610e9f98eaa1ff4de4f5b010b1105985d9fa1d7eb255df8b9151230d5e'),
           ('test4@gatech.edu', 'Some third ML judge', 'Judge', 'b3195525f8f84b10adc85ada7deab84a30c579e777ae27973c92f812d84476e3', '46b0d61cccb35a2b4e15796abaf66c4daf50b9fc0a0efe3fee825b375301eb0dbabb2193926113b970f8b6285fdb56436c7d58dd13c0424356e0457cc71e7496a0dde47046d19f2dcde24e6956aa0599340c8b080c582a5cb7171193e7167894a0406f610e9f98eaa1ff4de4f5b010b1105985d9fa1d7eb255df8b9151230d5e'),
           ('test5@gatech.edu', 'Some UI judge', 'Judge', 'b3195525f8f84b10adc85ada7deab84a30c579e777ae27973c92f812d84476e3', '46b0d61cccb35a2b4e15796abaf66c4daf50b9fc0a0efe3fee825b375301eb0dbabb2193926113b970f8b6285fdb56436c7d58dd13c0424356e0457cc71e7496a0dde47046d19f2dcde24e6956aa0599340c8b080c582a5cb7171193e7167894a0406f610e9f98eaa1ff4de4f5b010b1105985d9fa1d7eb255df8b9151230d5e'),
           ('test6@gatech.edu', 'Some Other UI judge', 'Judge', 'b3195525f8f84b10adc85ada7deab84a30c579e777ae27973c92f812d84476e3', '46b0d61cccb35a2b4e15796abaf66c4daf50b9fc0a0efe3fee825b375301eb0dbabb2193926113b970f8b6285fdb56436c7d58dd13c0424356e0457cc71e7496a0dde47046d19f2dcde24e6956aa0599340c8b080c582a5cb7171193e7167894a0406f610e9f98eaa1ff4de4f5b010b1105985d9fa1d7eb255df8b9151230d5e'),
           ('test7@gatech.edu', 'Some Third UI judge', 'Judge', 'b3195525f8f84b10adc85ada7deab84a30c579e777ae27973c92f812d84476e3', '46b0d61cccb35a2b4e15796abaf66c4daf50b9fc0a0efe3fee825b375301eb0dbabb2193926113b970f8b6285fdb56436c7d58dd13c0424356e0457cc71e7496a0dde47046d19f2dcde24e6956aa0599340c8b080c582a5cb7171193e7167894a0406f610e9f98eaa1ff4de4f5b010b1105985d9fa1d7eb255df8b9151230d5e'),
           ('letmein@gmail.com', 'Some random dudes name', 'Pending', 'b3195525f8f84b10adc85ada7deab84a30c579e777ae27973c92f812d84476e3', '46b0d61cccb35a2b4e15796abaf66c4daf50b9fc0a0efe3fee825b375301eb0dbabb2193926113b970f8b6285fdb56436c7d58dd13c0424356e0457cc71e7496a0dde47046d19f2dcde24e6956aa0599340c8b080c582a5cb7171193e7167894a0406f610e9f98eaa1ff4de4f5b010b1105985d9fa1d7eb255df8b9151230d5e');

-- projects
INSERT INTO projects(devpost_id, name, table_number, expo_number)
    VALUES (1, 'hack1', 1, 1),
           (2, 'hack2', 2, 1),
           (3, 'hack3', 3, 1),
           (4, 'hack4', 4, 1),
           (5, 'hack5', 5, 1);

-- categories
INSERT INTO categories(name, is_primary)
    VALUES ('Best ML Hack', True),
           ('Best Mobile', True);

-- criteria
INSERT INTO criteria(name, rubric, min_score, max_score, category_id)
    VALUES ('Tensorflow Usage', 'scored 1 - 10', 1, 10, 1),
           ('Training Score', 'scored 1 - 10', 1, 10, 1),
           ('Testing Score', 'scored 1 - 10', 1, 10, 1),
           ('UI Score', 'scored 1 - 5', 1, 5, 2),
           ('UX Score', 'scored 1 - 5', 1, 5, 2),
           ('Can be used?', 'scored 1 - 5', 1, 5, 2);

-- ballots
INSERT INTO ballots(project_id, criteria_id, user_id, judge_priority, ballot_status, score)
    VALUES (1, 1, 2, 1, 'Submitted', 8), -- Judge 2, Project hack1, ML
           (1, 2, 2, 1, 'Submitted', 9),
           (1, 3, 2, 1, 'Submitted', 7),
           (3, 1, 2, 2, 'Submitted', 4), -- Judge 2, Project hack3, ML
           (3, 2, 2, 2, 'Submitted', 3),
           (3, 3, 2, 2, 'Submitted', 4),
           (4, 1, 2, 3, 'Submitted', 1), -- Judge 2, Project hack4, ML
           (4, 2, 2, 3, 'Submitted', 1),
           (4, 3, 2, 3, 'Submitted', 1),
           (5, 1, 2, 4, 'Submitted', 6), -- Judge 2, Project Hack5, ML
           (5, 2, 2, 4, 'Submitted', 7),
           (5, 3, 2, 4, 'Submitted', 8),

           (4, 1, 3, 1, 'Submitted', 6), -- Judge 3, Project hack4, ML
           (4, 2, 3, 1, 'Submitted', 8),
           (4, 3, 3, 1, 'Submitted', 10),
           (5, 1, 3, 2, 'Submitted', 9), -- Judge 3, Project Hack5, ML
           (5, 2, 3, 2, 'Submitted', 5),
           (5, 3, 3, 2, 'Submitted', 2),
           (1, 1, 3, 3, 'Assigned', NULL), -- Judge 3, Project hack1, ML
           (1, 2, 3, 3, 'Assigned', NULL),
           (1, 3, 3, 3, 'Assigned', NULL),
           (3, 1, 3, 4, 'Pending', NULL), -- Judge 3, Project hack3, ML
           (3, 2, 3, 4, 'Pending', NULL),
           (3, 3, 3, 4, 'Pending', NULL),

           (1, 1, 4, 1, 'Submitted', 10), -- Judge 4, Project hack1, ML
           (1, 2, 4, 1, 'Submitted', 7),
           (1, 3, 4, 1, 'Submitted', 10),
           (3, 1, 4, 2, 'Submitted', 2), -- Judge 4, Project hack3, ML
           (3, 2, 4, 2, 'Submitted', 6),
           (3, 3, 4, 2, 'Submitted', 3),
           (4, 1, 4, 3, 'Assigned', NULL), -- Judge 4, Project hack4, ML
           (4, 2, 4, 3, 'Assigned', NULL),
           (4, 3, 4, 3, 'Assigned', NULL),
           (5, 1, 4, 4, 'Pending', NULL), -- Judge 4, Project Hack5, ML
           (5, 2, 4, 4, 'Pending', NULL),
           (5, 3, 4, 4, 'Pending', NULL),

           (1, 4, 5, 1, 'Submitted', 4), -- Judge 5, Project hack1, Mobile
           (1, 5, 5, 1, 'Submitted', 4),
           (1, 6, 5, 1, 'Submitted', 9),
           (2, 4, 5, 2, 'Submitted', 3), -- Judge 5, Project hack2, Mobile
           (2, 5, 5, 2, 'Submitted', 2),
           (2, 6, 5, 2, 'Submitted', 5),
           (4, 4, 5, 3, 'Submitted', 8), -- Judge 5, Project hack4, Mobile
           (4, 5, 5, 3, 'Submitted', 6),
           (4, 6, 5, 3, 'Submitted', 8),

           (1, 4, 6, 1, 'Submitted', 3), -- Judge 6, Project hack1, Mobile
           (1, 5, 6, 1, 'Submitted', 5),
           (1, 6, 6, 1, 'Submitted', 7),
           (2, 4, 6, 2, 'Submitted', 3), -- Judge 6, Project hack2, Mobile
           (2, 5, 6, 2, 'Submitted', 4),
           (2, 6, 6, 2, 'Submitted', 6),
           (4, 4, 6, 3, 'Assigned', NULL), -- Judge 6, Project hack4, Mobile
           (4, 5, 6, 3, 'Assigned', NULL),
           (4, 6, 6, 3, 'Assigned', NULL),

           (1, 4, 7, 3, 'Assigned', NULL), -- Judge 7, Project hack1, Mobile
           (1, 5, 7, 3, 'Assigned', NULL),
           (1, 6, 7, 3, 'Assigned', NULL),
           (2, 4, 7, 2, 'Submitted', 6), -- Judge 7, Project hack2, Mobile
           (2, 5, 7, 2, 'Submitted', 8),
           (2, 6, 7, 2, 'Submitted', 7),
           (4, 4, 7, 1, 'Submitted', 6), -- Judge 7, Project hack4, Mobile
           (4, 5, 7, 1, 'Submitted', 2),
           (4, 6, 7, 1, 'Submitted', 7);

-- project_categories
INSERT INTO project_categories(project_id, category_id)
    VALUES (1, 1), -- Project hack1 competes in ML and Mobile
           (1, 2),
           (2, 2), -- Project hack2 competes in Mobile
           (3, 1), -- Project hack3 competes in ML
           (4, 1), -- Project hack4 competes in ML and Mobile
           (4, 2),
           (5, 1); -- Project hack5 competes in ML