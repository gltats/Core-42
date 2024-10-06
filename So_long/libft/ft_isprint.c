/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_isprint.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/13 10:13:30 by tgomes-l          #+#    #+#             */
/*   Updated: 2022/12/17 15:04:47 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

//The isdigit() function tests for a printable characters 
int	ft_isprint(int x)
{
	if (x >= 32 && x <= 126)
		return (1);
	return (0);
}
