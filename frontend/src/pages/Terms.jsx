import BackTo from "../components/backtohomepage/BackTo";
import BottomBar from "../components/BottomBar";
import BackgroundShapes from "../components/BackgroundShapes";
import Logo from "../assets/Logo.png"

import "./terms.css"

export default function Terms() {
    const terms = `Última atualização: 21 de agosto de 2026

1. Sobre o site
O site tem como objetivo apresentar os serviços oferecidos pela Silva Carvalho Festas e Eventos, possibilitar o contato com a empresa e permitir que usuários cadastrados utilizem funcionalidades relacionadas à solicitação e organização de eventos.

2. Cadastro e informações fornecidas
Ao realizar um cadastro ou preencher formulários no site, o usuário se compromete a fornecer informações verdadeiras, completas e atualizadas.
O usuário é responsável pela manutenção da segurança de suas credenciais de acesso e por qualquer atividade realizada em sua conta.

3. Solicitação de serviços
O preenchimento de informações relacionadas a um evento ou solicitação de orçamento não representa, por si só, a confirmação da contratação do serviço.
A contratação somente será considerada realizada após a confirmação e formalização entre o cliente e a empresa, conforme as condições acordadas entre as partes.

4. Uso adequado
O usuário se compromete a utilizar o site de forma legal e adequada, não sendo permitido:
• utilizar o site para atividades ilícitas;
• fornecer informações falsas ou de terceiros sem autorização;
• tentar acessar áreas ou informações que não estejam disponíveis ao usuário;
• interferir no funcionamento do site;
• realizar qualquer atividade que possa comprometer a segurança da plataforma.

5. Conteúdo e propriedade intelectual
Os textos, imagens, logotipos, elementos gráficos, identidade visual e demais conteúdos disponibilizados pela empresa são protegidos pela legislação aplicável.
A utilização, reprodução ou distribuição de conteúdos do site sem autorização prévia poderá estar sujeita às medidas previstas na legislação.

6. Disponibilidade do site
A empresa busca manter o site disponível e funcionando corretamente, mas não garante que o serviço estará livre de interrupções, falhas ou indisponibilidades ocasionais.
O site poderá passar por manutenções, atualizações ou alterações sem aviso prévio.

7. Alterações
A Silva Carvalho Festas e Eventos poderá atualizar estes Termos de Uso sempre que necessário. A versão mais recente estará disponível nesta página.

8. Contato
Em caso de dúvidas sobre estes Termos de Uso, entre em contato conosco através dos canais disponibilizados no site.
`
    const politics = `Última atualização: 21 de agosto de 2026

A Silva Carvalho Festas e Eventos valoriza a privacidade de seus clientes e usuários. Esta Política de Privacidade explica como coletamos, utilizamos e protegemos informações pessoais fornecidas através do nosso site.

1. Dados coletados
Dependendo da utilização do site, podemos coletar informações como:
• nome;
• endereço de e-mail;
• número de telefone;
• informações de acesso à conta;
• informações fornecidas durante a solicitação de serviços ou eventos;
• informações técnicas necessárias para o funcionamento e segurança do site.
Coletamos apenas as informações necessárias para as finalidades relacionadas ao funcionamento dos nossos serviços.

2. Como utilizamos os dados
As informações coletadas podem ser utilizadas para:
• criar e administrar contas de usuários;
• entrar em contato com clientes;
• responder solicitações e dúvidas;
• elaborar e administrar solicitações de eventos;
• enviar comunicações relacionadas aos serviços;
• permitir recuperação de acesso à conta;
• melhorar a segurança e o funcionamento do site;
• cumprir obrigações legais.

3. Compartilhamento de informações
Não comercializamos dados pessoais dos nossos usuários.
As informações poderão ser compartilhadas com prestadores de serviços e ferramentas utilizadas para o funcionamento da plataforma quando isso for necessário para executar determinada finalidade, sempre observando a legislação aplicável.

4. Segurança
Adotamos medidas técnicas e administrativas destinadas a proteger as informações pessoais contra acessos não autorizados, perda, alteração ou utilização indevida.
Apesar dos esforços para manter os dados seguros, nenhum sistema conectado à internet pode garantir segurança absoluta.

5. Cookies e tecnologias semelhantes
O site poderá utilizar cookies e tecnologias semelhantes para manter funcionalidades, melhorar a experiência do usuário e auxiliar na segurança da plataforma.
O usuário poderá controlar determinadas permissões de cookies através das configurações disponíveis em seu navegador.

6. Armazenamento dos dados
Os dados pessoais são mantidos pelo período necessário para cumprir as finalidades para as quais foram coletados, atender obrigações legais ou exercer direitos da empresa.
Quando não houver mais necessidade de manutenção dos dados, eles poderão ser eliminados, observadas as obrigações legais aplicáveis.

7. Direitos do usuário
Nos termos da legislação aplicável, especialmente da Lei Geral de Proteção de Dados (LGPD), o usuário poderá solicitar informações sobre o tratamento de seus dados e exercer os direitos previstos em lei, observadas as condições e limitações legais.

8. Alterações nesta política
Esta Política de Privacidade poderá ser atualizada para refletir alterações em nossos serviços, procedimentos ou na legislação aplicável.
A versão mais recente estará sempre disponível nesta página.

9. Contato
Para dúvidas, solicitações ou assuntos relacionados à privacidade e proteção de dados, o usuário poderá entrar em contato através dos canais oficiais disponibilizados no site.

`

    return(
        <div className="terms-page">
            <BackTo />
            <main>
                <section className="terms-title">
                    <div className="terms-logo">
                        <img src={Logo} alt="Logo" />
                    </div>
                </section>

                <section className="copyright-section">
                    <h1>Copyright</h1>
                    <div className="copyright-text">
                        <p><strong>Política de Direitos Autorais</strong></p>
                        <p className="copyright-content"> 
                            Todo o conteúdo deste site, incluindo textos, imagens, 
                            elementos gráficos, identidade visual e software desenvolvido 
                            para a Silva Carvalho Festas e Eventos, é protegido pela legislação 
                            aplicável de direitos autorais e propriedade intelectual. A 
                            reprodução ou utilização não autorizada desses materiais é proibida.
                        </p>

                        <p>© 2026 Silva Carvalho Festas e Eventos</p>
                    </div>
                </section>

                <section className="terms-and-politics">
                    <div className="terms-and-politics-container">
                        <div className="terms-group">
                            <h1>Termos</h1>
                            <div className="terms-text">
                                <p style={{ whiteSpace: "pre-line" }}>
                                    {terms}
                                </p>
                            </div>
                        </div>

                        <div className="politics-group">
                            <h1>Políticas</h1>
                            <div className="politics-text">
                                <p style={{ whiteSpace: "pre-line" }}>
                                    {politics}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <BottomBar />
            <BackgroundShapes />
        </div>
    );
}