# Generated by Django 3.0.3 on 2020-02-27 19:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_auto_20200227_2014'),
    ]

    operations = [
        migrations.RenameField(
            model_name='kalas',
            old_name='zipCode',
            new_name='postal',
        ),
    ]