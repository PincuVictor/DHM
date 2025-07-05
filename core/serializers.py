from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, ShippingAddress, Product, OrderProduct, Order
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from .tokens import EmailVerificationTokenGenerator

token_generator = EmailVerificationTokenGenerator()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data, is_active=False)

        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        activation_link = f"http://localhost:5173{reverse('email-verify', kwargs={'uidb64': uid, 'token': token})}"

        subject = "Verify your email"
        from_email = "dhm.clothing.official@gmail.com"
        to_email = user.email

        html_content = render_to_string("emails/email_verification.html", {
            "user": user,
            "activation_link": activation_link
        })

        email = EmailMultiAlternatives(subject, "Click the link to verify your account.", from_email, [to_email])
        email.attach_alternative(html_content, "text/html")
        email.send()

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email is None or password is None:
            raise serializers.ValidationError("Email and password are required.")

        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid credentials.")

        data = super().validate(attrs)

        return data


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'
        read_only_fields = ['user']


class ProductSerializer(serializers.Serializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderSerializer(serializers.Serializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user']


class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = '__all__'
        read_only_fields = ['order', 'product']
