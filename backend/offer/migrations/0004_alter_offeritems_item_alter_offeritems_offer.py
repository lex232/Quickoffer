# Generated by Django 4.1.6 on 2024-04-23 19:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('offer', '0003_offerforcustomer_items'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offeritems',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='selected_item', to='offer.item'),
        ),
        migrations.AlterField(
            model_name='offeritems',
            name='offer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='selected_offer', to='offer.offerforcustomer'),
        ),
    ]