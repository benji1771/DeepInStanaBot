const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, GatewayIntentBits, InteractionCollector } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Stana is ready to take it deep.');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});



client.login(process.env.TOKEN);

