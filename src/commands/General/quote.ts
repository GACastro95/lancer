import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { TextBasedChannel, MessageEmbed, ColorResolvable } from 'discord.js';

@ApplyOptions<Command.Options>({
	aliases: ['q'],
	description: 'embeds a quote to a discord message',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option //
						.setName('message-link')
						.setDescription('Message to quote')
						.setRequired(true)
				)
		);
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		try {
			const quote = interaction.options.getString('message-link');
			const messageProps = quote!.split('/').splice(4, 3);
			const guildId = messageProps[0];
			const channelId = messageProps[1];
			const messageId = messageProps[2];

			const guild = await interaction.client.guilds.fetch(guildId);
			const channelInfo = await guild.channels.fetch(channelId);
			const channel = channelInfo as TextBasedChannel;

			const message = await channel?.messages.fetch(messageId, {
				cache: true,
				force: true
			});
			const user = await guild.members.fetch(message.author.id);
			const attachments = message.attachments.map((e) => e.url);
			const sticker = message.stickers.first()?.url;
			var embed;

			if (message.embeds.length > 0) {
				embed = message.embeds[0];
                console.log(embed)
				embed
					.setTitle(`${embed.author?.name ?? ''}`)
					.setImage(embed.image?.proxyURL ?? embed.thumbnail?.url ?? '')
					.setThumbnail(`${embed.author?.proxyIconURL ?? ''}`)
					.setAuthor({ name: `${user.displayName} (${user.user.tag}) posted...`, iconURL: `${user.displayAvatarURL()}` });
				if (embed.url) {
					embed.setFields({ name: `Source`, value: `[go to link](${embed.url})` }).setURL('');
				}
			} else {
				var date = new Date(message.createdTimestamp);
				var hour = date.getUTCHours();
				var minutes = date.getUTCMinutes();

				embed = new MessageEmbed()
					.setAuthor({ name: `${user.displayName} (${user.user.tag}) said...`, iconURL: `${user.displayAvatarURL()}` })
					.setURL(quote!)
					.setColor(user.displayColor as ColorResolvable)
					.setDescription(`${message.content}`)
					.setImage(sticker ?? attachments[0])
					.setFooter({
						text: `${guild.name} • #${channelInfo!.name} • ${date.toLocaleDateString('ja-JP')} at ${hour}:${minutes} UTC`,
						iconURL: guild!.iconURL()!
					});

                    if (message.reference) {
                        var reply = await message.fetchReference();
                        embed.addFields(
                            { name: `Replying to`, value: `[${reply.content}](${reply.url})` },
                            { name: `Source`, value: `[jump to message](${quote})`, inline: true }
                        )
                    } else {
                        embed.addFields(
                            { name: `Source`, value: `[jump to message](${quote})`, inline: true }
                        )
                    }
			}

			return interaction.reply({ embeds: [embed] });
		} catch (error) {
			const message = error as Error;
			return interaction.reply({ content: `Error: ${message.message}`, ephemeral: true });
		}
	}
}
