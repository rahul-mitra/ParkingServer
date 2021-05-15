# ParkingServer
A solution to parking problem using rest API and MongoDB
### see below apis
{
	"info": {
		"_postman_id": "b416ce2b-77a0-45cc-91f3-da18b11c45d8",
		"name": "ParkingServer",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "GetServerRunningStatus",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:3000",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000"
				}
			},
			"response": []
		},
		{
			"name": "Register User",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"email\": \"rahul1991mitra@gmail.com\",\r\n    \"password\": \"12345\",\r\n    \"city\": \"durg\",\r\n    \"fullName\": \"Rahul Mitra\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3000/register",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"register"
					]
				}
			},
			"response": []
		},
		{
			"name": "Create Parking",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"isReserved\":false\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3000/createParking",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"createParking"
					]
				}
			},
			"response": []
		},
		{
			"name": "Get All Parkings",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:3000/getAllParkings",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"getAllParkings"
					]
				}
			},
			"response": []
		},
		{
			"name": "Get All Booked Parkings",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:3000/getAllBookedParkings",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"getAllBookedParkings"
					]
				}
			},
			"response": []
		},
		{
			"name": "Get All Users",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:3000/getAllUsers",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"getAllUsers"
					]
				}
			},
			"response": []
		},
		{
			"name": "Book Parking",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"email\":\"rahul1991mitra@gmail.com\",\r\n    \"isReserved\":false\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3000/bookParking",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"bookParking"
					]
				},
				"description": "json body\r\n\"email\" : \"someEmail\",\r\n\"isReserved\" : boolean"
			},
			"response": []
		}
	]
}
