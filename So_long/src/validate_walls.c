/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   validate_walls.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42wolfsburg>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/26 16:44:52 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/04/27 22:32:44 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

// get the index of the last character in the current row
// check if the last character in the row is '0', 'P', 'C', or 'E'
// move to the start of the next row
static int	right_wall(t_data **data)
{
	int	i;
	int	row_end;

	i = (*data)->map_width;
	while (i < (*data)->map_height * ((*data)->map_width + 1))
	{
		row_end = i + (*data)->map_width;
		if ((*data)->map[row_end] == '0' || (*data)->map[row_end] == 'P'
			|| (*data)->map[row_end] == 'C' || (*data)->map[row_end] == 'E')
			return (0);
		i += (*data)->map_width + 1;
	}
	return (1);
}

//The if statement checks whether the current index is at the start of a 
//new line by using the modulo operator % to see if the 
//index is a multiple of (*data)->map_width + 1.
//If the current index is at the start of a new line,
//it checks whether the value 
//at that index in the map is '1' or '0' using the comparison operator !=.
static int	border_walls(t_data **data)
{
	int	index;

	index = 0;
	while (index < (*data)->map_height * ((*data)->map_width + 1))
	{
		if (index % ((*data)->map_width + 1) == 0 && (*data)->map[index] != '1')
			return (0);
		index++;
	}
	return (1);
}

static int	top_wall(t_data **data)
{
	int	i;

	i = 0;
	while (i < (*data)->map_width)
	{
		if ((*data)->map[i] != '1')
			return (0);
		i++;
	}
	return (1);
}

static int	botton_wall(t_data **data)
{
	int	i;
	int	length_sum;

	(*data)->map_width = (*data)->map_width + 1;
	length_sum = (*data)->map_height * (*data)->map_width;
	i = length_sum - (*data)->map_width;
	while (i < length_sum)
	{
		if ((*data)->map[i] == '0' || (*data)->map[i] == 'P'
			|| (*data)->map[i] == 'C' || (*data)->map[i] == 'E')
			return (0);
		i++;
	}
	return (1);
}

int	is_map_closed(t_data **data)
{
	if (!right_wall(data))
	{
		ft_putstr("The map is not closed on the right\n");
		return (0);
	}
	if (!border_walls(data))
	{
		ft_putstr("The map is not closed on the left\n");
		return (0);
	}
	if (!top_wall(data))
	{
		ft_putstr("The map is not closed on the top\n");
		return (0);
	}
	if (!botton_wall(data))
	{
		ft_putstr("The map is not closed in the botton\n");
		return (0);
	}
	return (1);
}
