# Sistema de Localização de Igrejas

Um aplicativo web responsivo desenvolvido em Angular com TailwindCSS para cadastro, visualização e busca de igrejas com funcionalidades de mapa interativo.

## 🚀 Funcionalidades

### 📝 Cadastro de Igrejas
- Formulário completo com validação
- Campos obrigatórios: nome, denominação, endereço, coordenadas GPS, responsável, telefone, e-mail e WhatsApp
- Obtenção automática de coordenadas GPS via geolocalização do navegador
- Interface responsiva para dispositivos móveis e desktop

### 🗺️ Visualização no Mapa
- Mapa interativo usando Leaflet/OpenStreetMap
- Marcadores personalizados para cada igreja
- Filtros por cidade, estado e denominação
- Ordenação por nome, distância ou denominação
- Informações detalhadas nos popups dos marcadores

### 🔍 Busca Avançada
- Barra de pesquisa por nome, denominação ou localização
- Filtros avançados por cidade, estado e denominação
- Busca por proximidade usando geolocalização
- Ordenação por distância, nome, denominação ou cidade
- Cálculo de distância em tempo real
- Funcionalidade para copiar informações de contato

### 📱 Interface Responsiva
- Design moderno com TailwindCSS
- Navegação otimizada para dispositivos móveis
- Menu hambúrguer para telas pequenas
- Layout adaptativo para diferentes tamanhos de tela

## 🛠️ Tecnologias Utilizadas

- **Angular 20** - Framework principal
- **TailwindCSS** - Framework de estilização
- **Leaflet** - Biblioteca de mapas interativos
- **TypeScript** - Linguagem de programação
- **LocalStorage** - Armazenamento local dos dados

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd systemlocation
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o aplicativo**
   ```bash
   npm start
   ```

4. **Acesse o aplicativo**
   Abra seu navegador e acesse `http://localhost:4200`

## 🎯 Como Usar

### Página Inicial
- Visualize estatísticas gerais do sistema
- Acesse rapidamente as principais funcionalidades
- Veja as últimas igrejas cadastradas

### Cadastrar Igreja
1. Clique em "Cadastrar Igreja" no menu
2. Preencha todos os campos obrigatórios
3. Use o botão "Obter Localização Atual" para coordenadas automáticas
4. Clique em "Cadastrar Igreja" para salvar

### Visualizar Mapa
1. Acesse a página "Mapa"
2. Use os filtros para refinar a busca
3. Clique nos marcadores para ver detalhes
4. Use a ordenação para organizar os resultados

### Buscar Igrejas
1. Acesse a página "Buscar"
2. Digite na barra de pesquisa
3. Aplique filtros conforme necessário
4. Use "Buscar Próximas" para encontrar igrejas próximas
5. Clique em "Ver no Mapa" ou "Copiar Contato"

## 📊 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── home/                 # Página inicial
│   │   ├── church-form/          # Formulário de cadastro
│   │   ├── church-map/           # Visualização do mapa
│   │   └── church-search/        # Busca avançada
│   ├── models/
│   │   └── church.model.ts       # Interfaces TypeScript
│   ├── services/
│   │   └── church.service.ts     # Lógica de negócio
│   ├── app.routes.ts             # Configuração de rotas
│   ├── app.html                  # Template principal
│   └── app.ts                    # Componente principal
├── index.html                    # HTML base
└── styles.css                    # Estilos globais
```

## 🔧 Configurações

### Armazenamento
- Os dados são salvos no localStorage do navegador
- Não há necessidade de banco de dados externo
- Os dados persistem entre sessões

### Geolocalização
- Requer permissão do usuário para acessar localização
- Funciona em navegadores modernos com suporte a geolocalização
- Fallback para entrada manual de coordenadas

### Mapa
- Utiliza OpenStreetMap como provedor de tiles
- Não requer chave de API
- Funciona offline com cache de tiles

## 🎨 Personalização

### Cores e Estilos
- Edite as classes TailwindCSS nos componentes
- Modifique as variáveis CSS no arquivo `styles.css`
- Personalize os ícones SVG nos templates

### Funcionalidades
- Adicione novos campos no modelo `Church`
- Implemente validações customizadas
- Integre com APIs externas para geocodificação

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet e mobile
- **Sistemas**: Windows, macOS, Linux, Android, iOS

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Servidor de Produção
```bash
npm install -g serve
serve -s dist/systemlocation
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do repositório.

---

**Desenvolvido com ❤️ usando Angular e TailwindCSS**
