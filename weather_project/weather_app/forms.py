from django import forms
from .models import City
import datetime

class CityForm(forms.Form):
    city = forms.CharField(label='City', max_length=100)

class GeoCityForm(forms.Form):
    city = forms.CharField(widget=forms.TextInput(attrs={'id':'city', 'max_length':'100', 'class':'form-control','placeholder': 'City'}), label=False)    
    limit = forms.FloatField(widget=forms.NumberInput(attrs={'id': 'query_limit', 'step': "1",'class': 'form-control', 'placeholder': 'Limit'}), min_value=1, max_value=5, label=False)

class MonthlyNormalsForm(forms.Form):
    queryCities = City.objects.all()
    city = forms.ModelChoiceField(widget=forms.Select(attrs={'class': 'form-control'}), queryset=queryCities, required=False, label=False)
    #lat = forms.ModelChoiceField(widget=forms.Select(attrs={'class': 'form-control'}), queryset=queryCities, required=False, label=False)
    #lon = forms.ModelChoiceField(widget=forms.Select(attrs={'class': 'form-control'}), queryset=queryCities, required=False, label=False)
    dtStart = forms.DateField(initial=datetime.datetime.today)
    dtEnd =  forms.DateField(initial=datetime.datetime.today) 
