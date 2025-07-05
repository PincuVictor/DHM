
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import *
from core.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', UserCreateView.as_view(), name='user-register'),
    path('verify-email/<uidb64>/<token>/', EmailVerifyView.as_view(), name='email-verify'),
    path('api/test/', SomeProtectedView.as_view(), name='test'),
    path('api/credentials/', GetCredentials.as_view(), name='credentials'),
    path('api/shipping/', ShippingAddressListCreateView.as_view(), name='shipping-address-list-create'),
    path('api/shipping/<int:pk>/', ShippingAddressDetailView.as_view(), name='shipping-address-detail'),
]
