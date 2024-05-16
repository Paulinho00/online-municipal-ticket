INSERT INTO USER_DATA (ROLE, EMAIL, LAST_NAME, NAME, PASSWORD)
VALUES
('TICKET_INSPECTOR', 'user1@email.com', 'Kowalski', 'Jan', 'password1'),
('PASSENGER', 'user2@email.com', 'Nowak', 'Anna', 'password2'),
('TICKET_INSPECTOR', 'user3@email.com', 'Wiśniewska', 'Marta', 'password3'),
('PASSENGER', 'user4@email.com', 'Jankowski', 'Marek', 'password4'),
('TICKET_INSPECTOR', 'user5@email.com', 'Kamińska', 'Ewa', 'password5'),
('PASSENGER', 'user6@email.com', 'Wróbel', 'Paweł', 'password6'),
('TICKET_INSPECTOR', 'user7@email.com', 'Zając', 'Agnieszka', 'password7'),
('PASSENGER', 'user8@email.com', 'Adamczyk', 'Tomasz', 'password8'),
('TICKET_INSPECTOR', 'user9@email.com', 'Nowakowska', 'Kinga', 'password9'),
('PASSENGER', 'user10@email.com', 'Krawczyk', 'Grzegorz', 'password10');


INSERT INTO TICKET (DURATION_SECONDS, PRICE, REDUCED, TICKET_TYPE)
VALUES 
(48 * 3600, 30.00, false, 'PERIODIC'),
(null, 5.00, false, 'DISPOSABLE'),
(0.5 * 3600, 3.50, false, 'TIMED'),
(48 * 3600, 15.00, true, 'PERIODIC'),
(null, 2.50, true, 'DISPOSABLE'),
(0.5 * 3600, 1.75, true, 'TIMED');


INSERT INTO TICKET_INSTANCE (ACTIVATION_TIMESTAMP, PURCHASE_TIMESTAMP, TICKET_ID, USER_ID, VEHICLE_ID)
VALUES
(null, '2024-05-08T09:30:00Z', 3, 7, null),
('2024-05-08T09:46:00Z', '2024-05-08T09:45:00Z', 5, 2, 456),
('2024-05-08T09:50:00Z', '2024-05-08T09:50:00Z', 1, 4, null),
('2024-05-08T09:55:00Z', '2024-05-08T09:55:00Z', 1, 1, null),
(null, '2024-05-08T10:00:00Z', 2, 8, 567),
(null, '2024-05-08T10:05:00Z', 5, 3, 890),
('2024-05-08T10:10:00Z', '2024-05-08T10:10:00Z', 4, 6, null),
('2024-05-08T10:16:00Z', '2024-05-08T10:15:00Z', 5, 9, 654),
(null, '2024-05-08T10:20:00Z', 3, 10, null),
('2024-05-08T10:45:00Z', '2024-05-08T10:25:00Z', 6, 5, null),
('2024-05-08T10:31:00Z', '2024-05-08T10:30:00Z', 2, 4, 123),
('2024-05-08T10:35:00Z', '2024-05-08T10:35:00Z', 1, 7, null),
('2024-05-08T10:40:00Z', '2024-05-08T10:40:00Z', 4, 2, null),
('2024-05-08T11:05:00Z', '2024-05-08T10:45:00Z', 3, 8, null),
(null, '2024-05-08T10:50:00Z', 5, 1, 567),
(null, '2024-05-08T10:55:00Z', 6, 6, null),
('2024-05-08T11:20:00Z', '2024-05-08T11:00:00Z', 6, 3, null),
('2024-05-08T11:06:00Z', '2024-05-08T11:05:00Z', 5, 9, 654),
('2024-05-08T11:11:00Z', '2024-05-08T11:10:00Z', 2, 10, 987),
('2024-05-08T11:15:00Z', '2024-05-08T11:15:00Z', 4, 5, null),
(null, '2024-05-08T09:30:00Z', 3, 7, null),
('2024-05-08T09:46:00Z', '2024-05-08T09:45:00Z', 5, 2, 456),
('2024-05-08T10:10:00Z', '2024-05-08T09:50:00Z', 6, 4, null),
('2024-05-08T09:55:00Z', '2024-05-08T09:55:00Z', 1, 1, null),
('2024-05-08T10:20:00Z', '2024-05-08T10:00:00Z', 6, 8, null),
('2024-05-08T10:06:00Z', '2024-05-08T10:05:00Z', 5, 3, 890),
('2024-05-08T10:10:00Z', '2024-05-08T10:10:00Z', 4, 6, null),
(null, '2024-05-08T10:15:00Z', 5, 9, 654),
(null, '2024-05-08T10:20:00Z', 3, 10, null),
('2024-05-08T10:26:00Z', '2024-05-08T10:25:00Z', 5, 5, 654);