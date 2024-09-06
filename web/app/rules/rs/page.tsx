import Link from 'next/link';

export default async function GamesPage() {
  return (
    <div className="text-content">
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <Link href="/rules" role="tab" className="tab">
          🇬🇧 English
        </Link>
        <Link href="/rules/rs" role="tab" className="tab tab-active">
          🇷🇸 Serbian
        </Link>
        <Link href="/rules/ru" role="tab" className="tab">
          🇷🇺 Russian
        </Link>
      </div>

      <h1>Pravila igre JEEX</h1>
      <ol>
        <li>
          <strong>Početak igre:</strong>
          <ul>
            <li>Igra se odvija na tabli 10x10 polja.</li>
            <li>
              Svaki igrač počinje sa dva žetona: ljubičastim (napadačkim) i
              zelenim (trkačkim).
            </li>
            <li>
              Zeleni žeton počinje sa brojem poena jednakim ukupnom broju
              igrača.
            </li>
            <li>Ljubičasti žeton počinje sa 0 poena.</li>
          </ul>
        </li>
        <li>
          <strong>Prvi potez:</strong>
          <ul>
            <li>
              Na početku igre imate 10 sekundi da postavite oba žetona na tablu.
            </li>
            <li>Prvo postavite zeleni žeton, zatim ljubičasti.</li>
            <li>Žetoni se ne mogu postaviti na isto polje.</li>
          </ul>
        </li>
        <li>
          <strong>Tok igre:</strong>
          <ul>
            <li>Igra se sastoji od 10 rundi, svaka traje 10 sekundi.</li>
            <li>
              U svakoj rundi možete pomeriti svaki od svojih žetona na susedno
              polje (horizontalno, vertikalno ili dijagonalno).
            </li>
            <li>
              Ako ne pomerite oba žetona do kraja runde, eliminirani ste iz
              igre.
            </li>
          </ul>
        </li>
        <li>
          <strong>Bodovanje:</strong>
          <ul>
            <li>Nakon svake runde, poeni se računaju i preraspodeljuju.</li>
            <li>
              Kada se ljubičasti žeton susretne sa zelenim žetonom na istom
              polju:
              <ol type="a">
                <li>
                  Ako ima više ili jednak broj ljubičastih žetona kao zelenih:
                  <ul>
                    <li>
                      Zeleni žeton daje 5 poena pomnoženih sa 2 na (broj
                      ljubičastih žetona minus 1).
                    </li>
                    <li>
                      Na primer, ako su 2 ljubičasta i 1 zeleni, zeleni će dati
                      10 poena.
                    </li>
                    <li>
                      Ako su 3 ljubičasta i 1 zeleni, zeleni će dati 20 poena.
                    </li>
                  </ul>
                </li>
                <li>
                  Ako ima više zelenih žetona:
                  <ul>
                    <li>
                      Svaki zeleni žeton daje 2 poena svakom ljubičastom žetonu.
                    </li>
                  </ul>
                </li>
              </ol>
            </li>
            <li>
              Svi dati poeni se ravnomerno raspoređuju među ljubičastim žetonima
              na polju.
            </li>
            <li>Poeni se zaokružuju na dve decimale.</li>
            <li>Ako zeleni žeton ostane bez poena, eliminiše se iz igre.</li>
          </ul>
        </li>
        <li>
          <strong>Strategija:</strong>
          <ul>
            <li>
              Ljubičasti žetoni pokušavaju da "uhvate" zelene kako bi dobili
              poene.
            </li>
            <li>
              Zeleni žetoni pokušavaju da izbegnu susret sa ljubičastima kako bi
              sačuvali svoje poene.
            </li>
            <li>
              Igrači moraju balansirati između napada i odbrane za maksimalne
              rezultate.
            </li>
          </ul>
        </li>
        <li>
          <strong>Kraj igre:</strong>
          <ul>
            <li>
              Igra se završava nakon 10 rundi ili kada ostane samo jedan igrač.
            </li>
            <li>
              Konačni rezultat igrača je zbir poena njegovih zelenih i
              ljubičastih žetona.
            </li>
          </ul>
        </li>
        <li>
          <strong>Određivanje pobednika:</strong>
          <ul>
            <li>Igrači se rangiraju prema njihovom konačnom rezultatu.</li>
            <li>Što više poena, to je više mesto na konačnoj tabeli.</li>
            <li>U slučaju izjednačenja, igrači dele odgovarajuće mesto.</li>
          </ul>
        </li>
      </ol>
      <p>
        JEEX je dinamična igra koja zahteva brzo donošenje odluka i strateško
        razmišljanje. Srećno i uživajte u igri!
      </p>
    </div>
  );
}
