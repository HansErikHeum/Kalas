"""denne filen har all koden for serializerene som sier hva som er forventet input/output for views"""
from rest_framework import serializers
from .models import Kalas, names, Foresporsel, Borst
from django.contrib.auth.models import User
from .google import addressToCoordinates, gmaps


class NamesSerializer(serializers.ModelSerializer):
    """enkel serializer for names modellen, som tar alle attributtene"""
    class Meta:
        model = names
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    """enkel serializer for innebygde User modellen, som tar id og username attributtene"""
    class Meta:
        model = User
        fields = ['id', 'username']


class BrukerSerializer(serializers.ModelSerializer):
    """enkel serializer for Kalas modellen, som tar alle attributtene fra UserSerializer og Kalas modellen"""
    user = UserSerializer()

    class Meta:
        model = Kalas
        fields = '__all__'


class BorstSerializer(serializers.ModelSerializer):
    """enkel serializer for Borst modellen, som tar alle attributten"""
    class Meta:
        model = Borst
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    """en serializer for registrering viewet som tar in all informasjon fra registreringsforumet og returnerer en lagd bruker"""
    capacity = serializers.IntegerField()
    fullName = serializers.CharField()
    phoneNumber = serializers.IntegerField()
    address = serializers.CharField()
    postal = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'password', 'postal',
                  'capacity', 'fullName', 'address', 'phoneNumber']

    def create(self, validated_data):
        """innebygd metode i Serializers.ModelSerializer som overskrives"""
        capacity = validated_data.pop('capacity')
        fullName = validated_data.pop('fullName')
        phoneNumber = validated_data.pop('phoneNumber')
        address = validated_data.pop('address')
        postal = validated_data.pop('postal')
        try:
            lat, lng = addressToCoordinates(address, postal)
        except:
            lat, lng = [400, 400]
        user = User.objects.create_user(**validated_data)
        kalas = Kalas.objects.create(
            user=user,
            capacity=capacity,
            fullName=fullName,
            phoneNumber=phoneNumber,
            address=address,
            postal=postal,
            lat=lat,
            lng=lng
        )
        return user


class NamesMapSerializer(serializers.ModelSerializer):
    """serializer som ingår KalasMapSerializer, tar attributten id og name fra names modellen"""
    class Meta:
        model = names
        fields = ['id', 'name']


# bruk denne hver gang man vil ha kalas og navn sammen
class KalasMapSerializer(serializers.ModelSerializer):
    """tar inn NameMapSerializer og tar attributter fra kalas modellen """
    names = NamesMapSerializer(many=True, read_only=True)

    class Meta:
        model = Kalas
        fields = ['id', 'fullName', 'capacity', 'lat', 'lng', 'names']


class MapSerializer(serializers.ModelSerializer):
    """tar in KalasMapSerializer og tar attributtene username og kalas fra User modellen, denne brukes i ActiveOnMAp viewet"""
    kalas = KalasMapSerializer()

    class Meta:
        model = User
        fields = ['username', 'kalas']


class ForesporselSerializer(serializers.ModelSerializer):  # funker nå
    """serializer som tar inn attributtene fra Foresporsel modellen, brukt i PostForesporsel viewet"""
    class Meta:
        model = Foresporsel
        fields = ['id', 'kalasSender', 'kalasReciver', 'message']
