import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import type { TextChannel } from 'discord.js';

@ApplyOptions<Command.Options>({
    aliases: ["s"],
    description: "sends a message to a channel",
    generateDashLessAliases: true,
	preconditions: ['OwnerOnly'],
})
export class UserCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName(this.name)
                .setDescription(this.description)
                .addChannelOption((option) =>
                    option //
                        .setName('channel')
                        .setDescription('Channel to get')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option //
                        .setName('message')
                        .setDescription('Message to send')
                        .setRequired(true)
                )
        );
    }

    public async chatInputRun(interaction: Command.ChatInputInteraction) {
        const channel = interaction.options.getChannel('channel') as TextChannel
        const message = interaction.options.getString('message')

        channel.send(message!)

        return interaction.reply({ content: `Message sent`, ephemeral: true })

    }
}

