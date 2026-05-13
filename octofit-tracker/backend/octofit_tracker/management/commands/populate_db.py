from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

from octofit_tracker import models as octo_models

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        User = get_user_model()
        User.objects.all().delete()

        octo_models.Team.objects.all().delete()
        octo_models.Activity.objects.all().delete()
        octo_models.Leaderboard.objects.all().delete()
        octo_models.Workout.objects.all().delete()

        # Teams
        marvel = octo_models.Team.objects.create(name='Team Marvel')
        dc = octo_models.Team.objects.create(name='Team DC')

        # Users
        users = [
            User(email='tony@stark.com', username='IronMan'),
            User(email='steve@rogers.com', username='CaptainAmerica'),
            User(email='bruce@wayne.com', username='Batman'),
            User(email='clark@kent.com', username='Superman'),
        ]
        for i, user in enumerate(users):
            user.set_password('password')
            user.save()
        # Assign teams manually if needed

        # Activities
        octo_models.Activity.objects.create(user=users[0], type='Running', duration=30, calories=300)
        octo_models.Activity.objects.create(user=users[1], type='Cycling', duration=45, calories=400)
        octo_models.Activity.objects.create(user=users[2], type='Swimming', duration=60, calories=500)
        octo_models.Activity.objects.create(user=users[3], type='Walking', duration=20, calories=150)

        # Workouts
        octo_models.Workout.objects.create(name='Full Body', description='Full body workout', duration=60)
        octo_models.Workout.objects.create(name='Cardio Blast', description='Intense cardio session', duration=45)

        # Leaderboard
        octo_models.Leaderboard.objects.create(user=users[0], points=1000)
        octo_models.Leaderboard.objects.create(user=users[1], points=900)
        octo_models.Leaderboard.objects.create(user=users[2], points=1100)
        octo_models.Leaderboard.objects.create(user=users[3], points=950)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
