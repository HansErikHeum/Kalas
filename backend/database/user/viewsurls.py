"""denne filen tar inn kun views som ikke er viewsets og legger dem inn i urlpatterns"""
from django.urls import path
from .views import registrationView, CustomAuthToken, ActiveOnMap, PostForesporselView, MergeKalasView
from rest_framework.authtoken.views import obtain_auth_token

app_name = "user"

urlpatterns = [
    path('api/register/', registrationView, name='register'),
    path('api/login/', CustomAuthToken.as_view(), name='login'),
    path('api/coordinates/', ActiveOnMap.as_view(), name='coordinates'),
    path('api/requests/', PostForesporselView, name='requests'),
    path('api/merge/', MergeKalasView, name='merge')
]
