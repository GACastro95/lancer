import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { TextChannel } from 'discord.js';

@ApplyOptions<Command.Options>({
	aliases: ['t'],
	description: 'sends a message to a channel',
	generateDashLessAliases: true,
	preconditions: ['OwnerOnly']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addBooleanOption((option) =>
					option //
						.setName('start')
						.setDescription('whether to start or stop triggers in this server')
						.setRequired(true)
				)
		);
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		interaction.guild?.channels.cache.forEach((channel) => {
			if (channel.isText()) {
				var c = channel as TextChannel;
				if (interaction.options.getBoolean('start')) {
					const collector = c.createMessageCollector({ filter: (m) => m.content.includes('discord') });
					console.log(interaction.client.eventNames());
					collector.on('collect', (m) => {
						console.log(`Collected ${m.content}`);
						channel.send('Poopy doopy');
					});

					collector.on('end', (collected) => {
						console.log(`Collected ${collected.size} items`);
					});
				}
			}
		});
		const channel = interaction.options.getChannel('channel') as TextChannel;

		// `m` is a message object that will be passed through the filter function
		const collector = channel.createMessageCollector({ filter: (m) => m.content.includes('discord') });

		collector.on('collect', (m) => {
			console.log(`Collected ${m.content}`);
			channel.send('Poopy doopy');
		});

		collector.on('end', (collected) => {
			console.log(`Collected ${collected.size} items`);
		});

		return interaction.reply({ content: `Message sent`, ephemeral: true });
	}
}
