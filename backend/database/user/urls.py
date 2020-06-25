"""denne filen tar kun inn viewsets og legger dem inn i urlpatterns """
from rest_framework import routers
from .views import BrukerViewSet, NamesViewSet, UserViewSet, BorstViewSet, registrationView

router = routers.DefaultRouter()
router.register('api/kalas', BrukerViewSet, 'kalas')
router.register('api/names', NamesViewSet, 'name')
router.register('api/users', UserViewSet, 'users')
router.register('api/borst', BorstViewSet, 'borst')

urlpatterns = router.urls
