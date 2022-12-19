# Generated by Django 4.1.2 on 2022-12-18 17:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0011_alter_playlistnode_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='playlistnode',
            name='project_id',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='playlistnode',
            name='post',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='home.post'),
        ),
    ]
