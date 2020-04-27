# Generated by Django 3.0.5 on 2020-04-27 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='product_type',
            field=models.CharField(choices=[('NORMAL_EXAM', 'Normál vizsgálat'), ('PRIORITY_EXAM', 'Elsőbbségi vizsgálat'), ('PRIORITY_EXAM_FRADI', 'Elsőbbségi vizsgálat Fradi Szurkolói Kártya kedvezménnyel')], default='NORMAL_EXAM', max_length=50),
            preserve_default=False,
        ),
    ]
