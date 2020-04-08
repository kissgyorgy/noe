# Generated by Django 3.0.5 on 2020-04-08 15:28

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('appointments', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Sample',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('sampled_at', models.DateTimeField(blank=True, help_text='The time when it is extraxted from a real person', null=True)),
                ('status', models.CharField(choices=[('EMPTY', 'empty'), ('SAMPLED', 'sampled'), ('IN_TRANSPORT', 'in transport'), ('WAITING_IN_LAB', 'waiting in lab'), ('EXAMINED', 'examined')], default='EMPTY', max_length=255)),
                ('result', models.CharField(choices=[('POSITIVE', 'positive'), ('NEGATIVE', 'negative'), ('NOT_TESTED_YET', 'not tested yet')], default='NOT_TESTED_YET', max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('location', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointments.Location')),
                ('seat', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointments.Seat')),
            ],
        ),
    ]
