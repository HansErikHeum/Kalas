from django.shortcuts import render
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializer import RegisterSerializer, MapSerializer, ForesporselSerializer, BrukerSerializer, NamesSerializer, UserSerializer, BorstSerializer
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import Kalas, names, Foresporsel, Borst

from rest_framework import generics, permissions

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken


# Create your views here.
"""ViewSet blir behandlet anderledes når det kommer til å gi dem en url path mer router, disse urlenne finnes i urls.py"""


class BrukerViewSet(viewsets.ModelViewSet):
    """et viewset for Brukere"""
    queryset = Kalas.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = BrukerSerializer


class NamesViewSet(viewsets.ModelViewSet):
    """et view set for names"""
    queryset = names.objects.all()
    permissions_classes = [permissions.IsAuthenticated]
    serializer_class = NamesSerializer


class UserViewSet(viewsets.ModelViewSet):
    """ et viewset for innebygde User"""
    queryset = User.objects.all()
    permissions_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer


class BorstViewSet(viewsets.ModelViewSet):
    """et viewset for Borst"""
    queryset = Borst.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = BorstSerializer


@api_view(['POST'])
def registrationView(request):
    """ et funksjonelt view for registrering, returnerer brukeren som ble registrert eller 400 bad request"""
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            kalas = user.kalas
            data['response'] = "201"
            data['token'] = Token.objects.get(user=user).key
            data['user_id'] = user.pk
            data['kalas_id'] = kalas.pk
            data['lat'] = kalas.lat
            data['lng'] = kalas.lng
            return Response(data)
        else:
            data['respons'] = "400"
            data['feil'] = "kalasnavn er tatt"
        return Response(data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])  # TEST MER OM GET FUNGERER HELT
def PostForesporselView(request):
    """et funksjonelt view for å sende og mota forespørsel om merge kalas"""
    data = {}

    if request.method == 'POST':
        serializer = ForesporselSerializer(data=request.data)
        if serializer.is_valid() and request.user.kalas.isActive == True:
            serializer.save()
            data['response'] = "201"
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            data['response'] = "400"
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        serializer = ForesporselSerializer(data=request.data)
        data = {}
        user = request.user
        if user.kalas.isActive == True:
            requests = Foresporsel.objects.all().filter(kalasReciver=user.kalas.id).filter(
                kalasSender__isActive=True)
            requestnr = 0
            for request in requests:
                requestnr += 1
                members = names.objects.all().filter(kalasID=request.kalasSender.id)
                info = {'id': request.id, 'kalasID': request.kalasSender.id, 'username': request.kalasSender.user.username,
                        'members': members.values('name'), 'message': request.message}
                data['total'] = requestnr
                data[str(requestnr)] = info
            return Response(data, status=status.HTTP_200_OK)
        else:
            data['resposnse'] = "400"
            return Response(data, status=status.HTTP_400_BAD_REQUEST)


class CustomAuthToken(ObtainAuthToken):
    """spesielt class based view for innloging som tar seg av token lookup, returnerer bruker info"""

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        kalas = user.kalas
        if kalas.isActive == False:
            kalas = user.kalas.visitKalas
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'kalas_id': kalas.pk,
            'capacity': kalas.capacity,
            'fullName': kalas.fullName,
            'phoneNumber': kalas.phoneNumber,
            'address': kalas.address,
            'postal': kalas.postal,
            'lat': kalas.lat,
            'lng': kalas.lng,
            'members': names.objects.all().filter(kalasID=kalas.pk).values('id', 'name')
        })


class ActiveOnMap(generics.ListAPIView):
    """class based view som returnerer alle aktive kalas"""

    def get_queryset(self):
        return User.objects.all().filter(kalas__isActive=True)
    serializer_class = MapSerializer


@api_view(['POST'])
def MergeKalasView(request):
    """funksjonelt view som tar seg av å merge to kalas"""
    if request.method == 'POST':
        requestDict = request.data
        requestID = requestDict['requestID']
        mergeRequest = Foresporsel.objects.get(pk=requestID)
        kalasSenderID = mergeRequest.kalasSender.id
        kalasRecieverID = mergeRequest.kalasReciver.id
        if request.user.kalas.id == kalasRecieverID:
            kalasReciever = Kalas.objects.get(pk=kalasRecieverID)
            kalasSender = Kalas.objects.get(pk=kalasSenderID)
            kalasSender.isActive = False
            kalasSender.visitKalas = kalasReciever
            nameSet = names.objects.all().filter(kalasID=kalasSenderID)
            kalasCapacity = kalasReciever.capacity
            #kalasReciever.capacity = kalasCapacity - len(nameSet) - 1
            for name in nameSet:
                names.objects.create(
                    kalasID=kalasReciever,
                    name=name
                )
            kalasSenderfullName = kalasSender.fullName
            names.objects.create(
                kalasID=kalasReciever,
                name=kalasSenderfullName
            )
            kalasSender.save()
            kalasReciever.save()
            print(kalasSender.isActive)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
