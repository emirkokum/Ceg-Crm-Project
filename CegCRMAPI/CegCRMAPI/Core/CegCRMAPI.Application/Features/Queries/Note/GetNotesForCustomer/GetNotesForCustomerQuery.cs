using AutoMapper;
using CegCRMAPI.Application.DTOs.Note;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Note.GetNotesForCustomer
{
    public class GetNotesForCustomerQuery : IRequest<ApiResponse<List<NoteDto>>>
    {
        public Guid CustomerId { get; set; }
    }

    public class GetNotesForCustomerQueryHandler : IRequestHandler<GetNotesForCustomerQuery, ApiResponse<List<NoteDto>>>
    {
        private readonly INoteRepository _noteRepository;
        private readonly IMapper _mapper;

        public GetNotesForCustomerQueryHandler(INoteRepository noteRepository, IMapper mapper)
        {
            _noteRepository = noteRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<NoteDto>>> Handle(GetNotesForCustomerQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var notes = await _noteRepository.GetNotesByCustomerIdAsync(request.CustomerId);
                var noteDtos = _mapper.Map<List<NoteDto>>(notes);
                return ApiResponse<List<NoteDto>>.CreateSuccess(noteDtos, "Notes retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<NoteDto>>.CreateError($"Failed to retrieve notes: {ex.Message}");
            }
        }
    }
} 