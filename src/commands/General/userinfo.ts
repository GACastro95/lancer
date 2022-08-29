import { ApplyOptions } from '@sapphire/decorators';
import { Command, Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { ColorResolvable, Message, MessageEmbed } from 'discord.js';

@ApplyOptions<Command.Options>({
	aliases: ['ui'],
	description: 'shows the info about the user in the server',
	generateDashLessAliases: true
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option //
						.setName('user')
						.setDescription('User to check the info of')
						.setRequired(false)
				)
		);
	}

	public async messageRun(message: Message, args: Args) {
		const userID = (await args.pick('member').catch(() => message.author)).id;
		const guild = message.guild;
		const user = await message.client.users.fetch(userID, { force: true });
		const guildUser = guild?.members.cache.get(userID);
		const status = guildUser?.presence?.activities.find((e) => e.type === 'CUSTOM');
		const playing = guildUser?.presence?.activities.find((e) => e.type === 'PLAYING');
		const state = guildUser?.presence?.status;
		const emoji = status?.emoji;
		const index = await guild?.members.fetch().then((e) =>
			e
				.sort((userA, userB) => userA.joinedTimestamp! - userB.joinedTimestamp!)
				.map((user) => user.id)
				.findIndex((id) => id === user.id)
		);
		const roles = guildUser?.roles.cache.filter((e) => e.rawPosition != 0);
		const shownRoles = 10;
		const emojiGuild = await message.client.guilds.fetch('789206305407631411');
		var contString = '';
		var sortedRoles = ['None'];
		var emojiUrl;

		if (roles) {
			sortedRoles = roles.sort((roleA, roleB) => roleB.position - roleA.position).map((e) => `<@&${e.id}>`);
			if (sortedRoles.length > shownRoles) {
				contString = `and ${sortedRoles.length - shownRoles} more roles`;
			}
		}

		if (emoji) {
			if (emoji?.animated == true) {
				emojiUrl = `https://cdn.discordapp.com/emojis/${status?.emoji?.id}.gif`;
			} else {
				emojiUrl = `https://cdn.discordapp.com/emojis/${status?.emoji?.id}.png`;
			}
			var tempEmoji = await emojiGuild?.emojis.create(emojiUrl, emoji.name!);
		}

		var embed = new MessageEmbed()
			.setTitle(`${guildUser?.nickname} (${user.tag})` ?? `${user.tag}`)
			.setDescription(
				`Status: ${tempEmoji! ?? ''} ${status?.state ?? `${state?.toString().charAt(0).toUpperCase()}${state?.toString().slice(1)}`}
                \n${`Playing: ${playing}` ?? ''}`
			)
			.setThumbnail(guildUser?.displayAvatarURL({ dynamic: true }) ?? user.displayAvatarURL({ dynamic: true }))
			.setColor(guildUser?.displayColor as ColorResolvable)
			.addFields(
				{ name: `Joined Discord on`, value: user.createdAt.toLocaleString('ja-JP'), inline: true },
				{ name: `Joined ${guild?.name} on`, value: guildUser?.joinedAt?.toLocaleString('ja-JP')!, inline: true },
				{ name: `Roles`, value: `${sortedRoles.slice(0, shownRoles).join(', ') ?? 'None'} ${contString}` }
			)
			.setImage(user.bannerURL({ dynamic: true, size: 256 }) ?? '')
			.setFooter({ text: `Member #${index! + 1} | User ID: ${user.id}`, iconURL: guild?.iconURL()! });

		if (emoji) {
			return send(message, { embeds: [embed] }).then(() => emojiGuild?.emojis.delete(tempEmoji!));
		} else {
			return send(message, { embeds: [embed] });
		}
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const userID = interaction.options.get('user')?.user?.id ?? interaction.user.id;
		const guild = interaction.guild;
		const user = await interaction.client.users.fetch(userID, { force: true });
		const guildUser = guild?.members.cache.get(userID);
		const status = guildUser?.presence?.activities.find((e) => e.type === 'CUSTOM');
		const playing = guildUser?.presence?.activities.find((e) => e.type === 'PLAYING');
		const state = guildUser?.presence?.status;
		const emoji = status?.emoji;
		const index = await guild?.members.fetch().then((e) =>
			e
				.sort((userA, userB) => userA.joinedTimestamp! - userB.joinedTimestamp!)
				.map((user) => user.id)
				.findIndex((id) => id === user.id)
		);
		const roles = guildUser?.roles.cache.filter((e) => e.rawPosition != 0);
		const shownRoles = 10;
		const emojiGuild = await interaction.client.guilds.fetch('789206305407631411');
		var contString = '';
		var sortedRoles = ['None'];
		var emojiUrl;
		var isPlayingString = '';

		if (playing) {
			isPlayingString = `\nPlaying ${playing}`;
		}

		if (roles) {
			sortedRoles = roles.sort((roleA, roleB) => roleB.position - roleA.position).map((e) => `<@&${e.id}>`);
			if (sortedRoles.length > shownRoles) {
				contString = `and ${sortedRoles.length - shownRoles} more roles`;
			}
		}

		if (emoji) {
			if (emoji?.animated == true) {
				emojiUrl = `https://cdn.discordapp.com/emojis/${status?.emoji?.id}.gif`;
			} else {
				emojiUrl = `https://cdn.discordapp.com/emojis/${status?.emoji?.id}.png`;
			}
			var tempEmoji = await emojiGuild?.emojis.create(emojiUrl, emoji.name!);
		}

		var embed = new MessageEmbed()
			.setTitle(`${guildUser?.nickname} (${user.tag})` ?? `${user.tag}`)
			.setDescription(
				`Status: ${tempEmoji! ?? ''} ${
					status?.state ?? `${state?.toString().charAt(0).toUpperCase()}${state?.toString().slice(1)}`
				}${isPlayingString}`
			)
			.setThumbnail(guildUser?.displayAvatarURL({ dynamic: true }) ?? user.displayAvatarURL({ dynamic: true }))
			.setColor(guildUser?.displayColor as ColorResolvable)
			.addFields(
				{ name: `Joined Discord on`, value: user.createdAt.toLocaleString('ja-JP'), inline: true },
				{ name: `Joined ${guild?.name} on`, value: guildUser?.joinedAt?.toLocaleString('ja-JP')!, inline: true },
				{ name: `Roles`, value: `${sortedRoles.slice(0, shownRoles).join(', ') ?? 'None'} ${contString}` }
			)
			.setImage(user.bannerURL({ dynamic: true, size: 256 }) ?? '')
			.setFooter({ text: `Member #${index! + 1} | User ID: ${user.id}`, iconURL: guild?.iconURL()! });

		if (emoji) {
			return interaction.reply({ embeds: [embed] }).then(() => emojiGuild?.emojis.delete(tempEmoji!));
		} else {
			return interaction.reply({ embeds: [embed] });
		}
	}
}
