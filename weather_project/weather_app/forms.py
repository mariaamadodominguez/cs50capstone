from django import forms
from .models import City
from datetime import datetime, timedelta

class CityForm(forms.Form):
    city = forms.CharField(widget=forms.TextInput(attrs={'id':'city', 'max_length':'100', 'class':'form-control','placeholder': 'Location'}), label=False)    
    
class GeoCityForm(forms.Form):
    city = forms.CharField(widget=forms.TextInput(attrs={'id':'city', 'max_length':'100', 'class':'form-control','placeholder': 'Location'}), label=False)    
    limit = forms.FloatField(widget=forms.NumberInput(attrs={'id': 'query_limit', 'step': "1",'class': 'form-control', 'placeholder': 'Limit'}), min_value=1, max_value=5, label=False)

class MonthlyNormalsForm(forms.Form):
    queryCities = City.objects.all()
    city = forms.CharField(widget=forms.TextInput(attrs={'id':'city', 'max_length':'100', 'class':'form-control','placeholder': 'Location'}), label=False)       
   
    dtInitial = datetime.now() - timedelta(days=365)
    dtStart = forms.DateField(
        initial=dtInitial,
        widget=forms.widgets.DateInput(
            attrs={'placeholder': 'Initial date...', 'type': 'text',
                'onfocus': "(this.type='date')", }
        ),
        label=False)
    dtEnd =  forms.DateField(
        initial=datetime.now(),
        widget=forms.widgets.DateInput(
            attrs={'placeholder': 'Final date...', 'type': 'text',
                'onfocus': "(this.type='date')", }
        ),
        label=False)
    