"""denne filen er for google map api'en"""
import googlemaps
from datetime import datetime


"""denne key'en må erstattes med eierens egen key som man får fra google"""
gmaps = googlemaps.Client(key='AIzaSyD-LS470NBBaQUKfNpdCQQvwLPGPMu_ZJE')


def addressToCoordinates(address, postal):
    """funksjon som gjør om steder til kooredinater via google maps api"""
    fullAddress = address + ", " + postal
    geocode_result = gmaps.geocode(fullAddress)
    lat = geocode_result[0]['geometry']['location']['lat']
    lng = geocode_result[0]['geometry']['location']['lng']
    return lat, lng
