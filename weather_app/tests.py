from django.test import Client, TestCase
from .models import WUser, City
# Create your tests here.
class ModelsTestCase(TestCase):

	def setUp(self):
		# Create cities (places)
		
		a = City.objects.create(city="AAA", lat =- 23.9335988, lon=-46.3286399)
		b = City.objects.create(city="BBB", lat = 43.364595, lon=-8.420271, country='ES', state='Galicia')
		City.objects.create(city='NullIsland', lat=0, lon=0)
		City.objects.create(city='invalidLat', lat=-100, lon=0)
		City.objects.create(city='invalidLon', lat=0, lon=200)

		WUser.objects.create(username='user1', email='x@y.z', password='123456')
		u2 = WUser.objects.create(username='user2', email='x@y.z', password='123456')
		u2.favouritesList.add(a.id)
		u2.favouritesList.add(b.id)

	def test_valid_city(self):
		c = City.objects.get(city="AAA")
		self.assertTrue(c.is_valid_city())
	
	def test_is_null_island(self):
		ic = City.objects.get(city="NullIsland")
		self.assertTrue(ic.is_null_island())
    
	def test_invalid_latitude(self):
		ic = City.objects.get(city="invalidLat")
		self.assertFalse(ic.is_valid_city())
    
	def test_invalid_longitude(self):
		ic = City.objects.get(city="invalidLon")
		self.assertFalse(ic.is_valid_city())    

	def test_no_favourites_count(self):
		u = WUser.objects.get(username='user1')
		self.assertEqual(u.FavouritesList_count, 0)
	
	def test_favourites_count(self):
		u = WUser.objects.get(username='user2')
		self.assertEqual(u.FavouritesList_count, 2)
		
	def test_invalid_current_weather(self):
		city = City.objects.get(city="NullIsland")
		c = Client()
		response = c.get(f"/currentweather/{city.id}")
		self.assertEqual(response.status_code, 404)

	def test_currentweather(self):
		city = City.objects.get(pk=1)
		c = Client()
		response = c.get(f"/currentweather/{city.id}")
		self.assertEqual(response.status_code, 200)
	
	def test_invalid_currentcity(self):
		city = City.objects.get(city="invalidLat")
		c = Client()
		response = c.get(f"/currentcity/{city.id}")
		self.assertEqual(response.status_code, 404)
