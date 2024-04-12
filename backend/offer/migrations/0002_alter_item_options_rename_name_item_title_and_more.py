# Generated by Django 4.1.6 on 2024-04-12 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('offer', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='item',
            options={'ordering': ['-pub_date', '-pub_time'], 'verbose_name': 'товар', 'verbose_name_plural': 'товары'},
        ),
        migrations.RenameField(
            model_name='item',
            old_name='name',
            new_name='title',
        ),
        migrations.AlterField(
            model_name='item',
            name='private_type',
            field=models.BooleanField(db_index=True, default=False, verbose_name='Приватность товара/ услуги'),
        ),
    ]