import sys
from argparse import ArgumentParser
from datetime import datetime, timedelta

import pytz
import requests
import yaml

BASE_URL = 'https://portal.ufsm.br/mobile/webservice/flutter'


def read_config() -> dict:
    with open('settings.yaml', 'r') as document:
        return yaml.safe_load(document)

def is_weekday(date: datetime, weekday: str) -> bool:
    return date.strftime('%a') == weekday

def resolve_restaurant_id(restaurant: int):
    match restaurant:
        case 2:
            return 41
        case _:
            return restaurant

def login(config, username: str, password: str) -> str:
    response = requests.post(
        f'{BASE_URL}/generateTokenJwt',
        json={
            'appName': config['environment']['app'],
            'deviceId': config['environment']['device-id'],
            'deviceInfo': config['environment']['device-info'],
            'messageToken': config['environment']['message-token'],
            'login': username,
            'senha': password,
        },
        headers={
            'User-Agent': 'Dart/3.12 (dart:io)',
            'x-ufsm-version': '50600',
            'Content-Type': 'application/json; charset=UTF-8'
        }
    )

    data = response.json()

    if data['error']:
        raise Exception(data.get('mensagem', 'Erro no login'))
    
    return data['body']['accessToken']

def schedule_meal(config, token: str, start: datetime, end: datetime, options: dict) -> list:
    payload = {
        'dataInicio': start.strftime('%Y-%m-%d %H:%M:%S'),
        'dataFim': end.strftime('%Y-%m-%d %H:%M:%S'),
        'idRestaurante': resolve_restaurant_id(options['restaurant']),
        'opcaoVegetariana': options['vegetarian'],
        'tiposRefeicoes': []
    }

    # O payload precisa ser enviado como uma lista de inteiros.
    if options['coffee']:
        payload['tiposRefeicoes'].append(1)

    if options['lunch']:
        payload['tiposRefeicoes'].append(2)

    if options['dinner']:
        payload['tiposRefeicoes'].append(3)

    response = requests.post(
        f'{BASE_URL}/ru/agendaRefeicoes',
        json=payload,
        headers={
            'User-Agent': 'Dart/3.12 (dart:io)',
            'x-ufsm-version': '50600',
            'X-UFSM-Device-ID': config['environment']['device-id'],
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json; charset=UTF-8'
        }
    )

    body = response.json().get('body', [])

    if isinstance(body, list):
        return body

    if isinstance(body, dict):
        return [body]

    return []

def find_schedules(config, date):
    filtered_schedules = filter(
        lambda schedule: is_weekday(date, schedule['weekday']),
        config['schedules']
    )

    return list(filtered_schedules)

def find_schedules_in_range(config, start_date, days_ahead: int):
    scheduled_days = []

    for offset in range(1, days_ahead + 1):
        target_date = start_date + timedelta(offset)
        schedules = find_schedules(config, target_date)

        if schedules:
            scheduled_days.append((target_date, schedules))

    return scheduled_days

def main():
    parser = ArgumentParser(
        prog='ruina',
        description='Agenda automaticamente as refeições do RU da UFSM.'
    )
    parser.add_argument('-u', '--username', required=True, help='Your UFSM app username.')
    parser.add_argument('-p', '--password', required=True, help='Your UFSM app password.')
    parser.add_argument(
        '--days-ahead',
        type=int,
        default=1,
        help='Number of days ahead to scan. Default is 1 (tomorrow only).'
    )
    args = parser.parse_args()

    print('Lendo configuração...')
    config = read_config()

    print('Procurando refeições para serem agendadas amanhã...')
    now = datetime.now(pytz.timezone('Brazil/East'))
    scheduled_days = find_schedules_in_range(config, now, args.days_ahead)

    if scheduled_days:
        total_schedules = sum(len(schedules) for _, schedules in scheduled_days)
        print(f'Encontrado {total_schedules} refeição(ões) para serem agendadas.')

        try:
            print('Logando no aplicativo...')
            access_token = login(config, args.username, args.password)
            for target_date, target_schedules in scheduled_days:
                print(f'Agendando refeições para {target_date.strftime("%d/%m/%Y")}...')

                for schedule in target_schedules:
                    print(f"Agendando refeições para o RU {schedule['restaurant']}... ({schedule})")

                    statuses = schedule_meal(config, access_token, target_date, target_date, schedule)

                    if not statuses:
                        print(f'Nenhuma resposta de agendamento para {target_date.strftime("%d/%m/%Y")}.')
                        continue

                    for status in statuses:
                        date = datetime.strptime(status['dataRefAgendada'], '%Y-%m-%d %H:%M:%S')
                        message = (
                            f"{date.strftime('%d/%m/%Y')} - "
                            f"RU {schedule['restaurant']} ({status['tipoRefeicao']}): "
                        )

                        if status['sucesso']:
                            print(message + 'Agendado com sucesso.')
                        else:
                            print('[Erro] ' + message + status['impedimento'] + '.')
        except Exception as exception:
            print(f'Falha ao agendar: {str(exception)}')
            sys.exit(1)
    else:
        print('Não há nenhuma refeição para ser agendada no período informado.')

if __name__ == '__main__':
    main()
