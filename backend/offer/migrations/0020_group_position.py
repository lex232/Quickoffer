# Generated by Django 4.1.6 on 2024-08-22 11:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('offer', '0019_alter_client_options_alter_offeritems_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='position',
            field=models.PositiveSmallIntegerField(blank=True, default=999, null=True, verbose_name='позиция'),
        ),
    ]