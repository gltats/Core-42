/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putendl_fd.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/18 17:09:19 by tgomes-l          #+#    #+#             */
/*   Updated: 2022/12/21 20:32:44 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_putendl_fd(char *s, int fd)
{
	while (*s)
	{
		ft_putchar_fd(*s++, fd);
	}
	ft_putchar_fd('\n', fd);
}

//int main(void)
//{
//	char *test = "Something to test";
//	char *test1 = "Something to test1";
//	
//	ft_putendl_fd(test, 0);	
//	ft_putendl_fd(test1, 0);	
//}