/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   so_long.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42wolfsburg>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/15 15:32:38 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/04/27 22:29:18 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

static char	*reading_file(t_data *data, char *buffer)
{
	char	*map;
	int		len_line;
	int		len;
	int		counter;

	len = 0;
	counter = 0;
	data->map_2d = ft_split(buffer, '\n');
	len_line = ft_strlen(data->map_2d[0]);
	while (data->map_2d[counter])
	{
		len++;
		counter++;
	}
	data->map_y = len;
	data->map_x = len_line;
	map = ft_strdup("");
	return (map);
}

t_data	*read_and_validate_map(int fd)
{
	char	*buf;
	t_data	*data;
	ssize_t	num_read;

	buf = (char *)malloc(sizeof(char) * 1200);
	if (buf == NULL)
		perror("malloc");
	num_read = read(fd, buf, 1200);
	if (num_read == -1)
	{
		perror("read");
		free(buf);
		return (NULL);
	}
	buf[num_read] = '\0';
	data = (t_data *)ft_calloc(sizeof(t_data), 1);
	data->map = buf;
	if (!is_map_valid(buf, &data))
	{
		free(buf);
		return (NULL);
	}
	data->map = reading_file(data, buf);
	return (data);
}

int	manage_fd(char *filename)
{
	int		fd;
	t_data	*data;

	fd = open(filename, O_RDONLY);
	if (fd == -1)
	{
		perror("open");
		return (1);
	}
	data = read_and_validate_map(fd);
	if (data == NULL)
	{
		return (1);
	}
	handle_mlx_graphics(data);
	free(data->map);
	close(fd);
	return (0);
}

int	main(int argc, char **argv)
{
	char	*dot;

	if (argc != 2)
	{
		ft_putstr("Please execute ./so_long with a map as argument\n");
		ft_putstr("example: ./so_long maps/map.ber\n");
		return (1);
	}
	else
	{	
		dot = ft_strrchr(argv[1], '.');
		if (dot == NULL || ft_strcmp(dot, ".ber") != 0)
		{
			ft_putstr("Invalid file extension.\n");
			ft_putstr("Only .ber files are supported.\n");
			return (1);
		}		
		if (manage_fd(argv[1]) == -1)
		{
			ft_putstr("An error occurred while reading the file.\n");
			return (1);
		}
	}
	return (0);
}
