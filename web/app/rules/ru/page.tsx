import Link from 'next/link';

export default async function GamesPage() {
  return (
    <div className="text-content">
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <Link href="/rules" role="tab" className="tab">
          🇬🇧 English
        </Link>
        <Link href="/rules/rs" role="tab" className="tab">
          🇷🇸 Serbian
        </Link>
        <Link href="/rules/ru" role="tab" className="tab tab-active">
          🇷🇺 Russian
        </Link>
      </div>

      <h1>Правила игры JEEX</h1>
      <ol>
        <li>
          <strong>Начало игры:</strong>
          <ul>
            <li>Игра проходит на поле 10x10 клеток.</li>
            <li>
              Каждый игрок начинает с двумя фишками: фиолетовой (атакующей) и
              зеленой (бегущей).
            </li>
            <li>
              Зеленая фишка начинает с количеством очков, равным общему числу
              игроков.
            </li>
            <li>Фиолетовая фишка начинает с 0 очков.</li>
          </ul>
        </li>
        <li>
          <strong>Первый ход:</strong>
          <ul>
            <li>
              В начале игры у вас есть 10 секунд, чтобы разместить обе ваши
              фишки на поле.
            </li>
            <li>Сначала разместите зеленую фишку, затем фиолетовую.</li>
            <li>Фишки нельзя ставить на одну клетку.</li>
          </ul>
        </li>
        <li>
          <strong>Ход игры:</strong>
          <ul>
            <li>Игра состоит из 10 раундов, каждый длится 10 секунд.</li>
            <li>
              В каждом раунде вы можете переместить каждую из ваших фишек на
              соседнюю клетку (по горизонтали, вертикали или диагонали).
            </li>
            <li>
              Если вы не сделали ход обеими фишками до конца раунда, вы
              выбываете из игры.
            </li>
          </ul>
        </li>
        <li>
          <strong>Подсчет очков:</strong>
          <ul>
            <li>
              После каждого раунда происходит подсчет и перераспределение очков.
            </li>
            <li>
              Когда фиолетовая фишка встречается с зеленой фишкой в одной
              клетке:
              <ol type="a">
                <li>
                  Если фиолетовых фишек больше или равно зеленым:
                  <ul>
                    <li>
                      Зеленая фишка отдает 5 очков, умноженных на 2 в степени
                      (количество фиолетовых фишек минус 1).
                    </li>
                    <li>
                      Например, если 2 фиолетовые и 1 зеленая, зеленая отдаст 10
                      очков.
                    </li>
                    <li>
                      Если 3 фиолетовые и 1 зеленая, зеленая отдаст 20 очков.
                    </li>
                  </ul>
                </li>
                <li>
                  Если зеленых фишек больше:
                  <ul>
                    <li>
                      Каждая зеленая фишка отдает по 2 очка каждой фиолетовой.
                    </li>
                  </ul>
                </li>
              </ol>
            </li>
            <li>
              Все отданные очки равномерно распределяются между фиолетовыми
              фишками в клетке.
            </li>
            <li>Очки округляются до двух знаков после запятой.</li>
            <li>
              Если у зеленой фишки заканчиваются очки, она выбывает из игры.
            </li>
          </ul>
        </li>
        <li>
          <strong>Стратегия:</strong>
          <ul>
            <li>
              Фиолетовые фишки стараются "поймать" зеленые для получения очков.
            </li>
            <li>
              Зеленые фишки пытаются избежать встречи с фиолетовыми, чтобы
              сохранить свои очки.
            </li>
            <li>
              Игроки должны балансировать между атакой и защитой для
              максимального результата.
            </li>
          </ul>
        </li>
        <li>
          <strong>Окончание игры:</strong>
          <ul>
            <li>
              Игра заканчивается после 10 раундов или когда остается только один
              игрок.
            </li>
            <li>
              Финальный счет игрока - сумма очков его зеленой и фиолетовой
              фишек.
            </li>
          </ul>
        </li>
        <li>
          <strong>Определение победителей:</strong>
          <ul>
            <li>Игроки ранжируются по их финальному счету.</li>
            <li>Чем больше очков, тем выше место в итоговой таблице.</li>
            <li>
              В случае равенства очков, игроки делят соответствующее место.
            </li>
          </ul>
        </li>
      </ol>
      <p>
        JEEX - это динамичная игра, требующая быстрого принятия решений и
        стратегического мышления. Удачи и приятной игры!
      </p>
    </div>
  );
}
