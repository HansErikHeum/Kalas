"""Denne filen inneholder kode for alle modellene/tabellene"""
from django.db import models
from django.contrib.auth.models import User

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# Create your models here


class Kalas(models.Model):
    """kalas modellen, inneholder info om kalaset og har en one-to-one relasjon til den innebygde User modellen"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    visitKalas = models.ForeignKey(
        'self', on_delete=models.DO_NOTHING, blank=True, null=True)
    isActive = models.BooleanField(default=True)
    capacity = models.IntegerField(default=0)
    fullName = models.CharField(max_length=100, default="default name")
    phoneNumber = models.IntegerField()
    address = models.CharField(max_length=40)
    postal = models.CharField(max_length=50)
    time = models.DateTimeField(auto_now_add=True)
    lat = models.FloatField(default=0)
    lng = models.FloatField(default=0)

    def __str__(self):
        return "user: %s, address: %s %s" % (self.user, self.address, self.postal)


class names(models.Model):
    """names tabellen har en mange til én relasjon med til kalas"""
    kalasID = models.ForeignKey(
        Kalas, on_delete=models.CASCADE, related_name='names')
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Foresporsel(models.Model):
    """foresporsel modellen har to mange til én relasjoner til kalas, en som sender og en som motar forespørselen"""
    kalasSender = models.ForeignKey(
        Kalas, on_delete=models.CASCADE, related_name='sender')
    kalasReciver = models.ForeignKey(
        Kalas, on_delete=models.CASCADE, related_name='reciver')
    message = models.CharField(max_length=200, default="merge med oss")


class Borst(models.Model):
    """model/tabell for alle børst strengene"""
    text = models.CharField(max_length=80)

    def __str__(self):
        return "text: " + self.text


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
